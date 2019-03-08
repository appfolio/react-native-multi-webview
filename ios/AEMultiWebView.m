#import "AEMultiWebView.h"

static NSString *const MessageHandlerName = @"ReactNativeWebView";

@interface RNCWKWebView (Custom)
- (NSMutableDictionary<NSString *, id> *)baseEvent;

- (WKWebView*)loadWKWebView;

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures;
@end

@interface AEMultiWebView () <WKUIDelegate, WKNavigationDelegate, UIScrollViewDelegate>

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, copy) RCTDirectEventBlock onCreateWebView;

@end

@implementation AEMultiWebView { }

@dynamic webView;

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures
{
  if (_onCreateWebView) {
    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary: @{
                                       @"url": (navigationAction.request.URL).absoluteString,
                                       }];
    NSInteger lockIdentifier = arc4random();
    event[@"lockIdentifier"] = @(lockIdentifier);
    WKWebView *nextWKWebView = [[WKWebView alloc] initWithFrame:self.bounds configuration:configuration];
    
    [self.delegate addWebView:nextWKWebView withIdentifier:lockIdentifier];
    
    _onCreateWebView(event);
    
    return nextWKWebView;
  }
  
  return [super webView:webView createWebViewWithConfiguration:configuration forNavigationAction:navigationAction windowFeatures:windowFeatures];
}

- (void)didMoveToWindow
{
  self.webView = [self.delegate removeWebViewWithIdentifier:_premadeWebViewIdentifier];
  [super didMoveToWindow];
  
  if (_premadeWebViewIdentifier != 0) {
    [self.delegate addWebView:self.webView withIdentifier:_premadeWebViewIdentifier];
    
    self.webView.scrollView.delegate = self;
    self.webView.UIDelegate = self;
    self.webView.navigationDelegate = self;
    
    self.webView.scrollView.scrollEnabled = self.scrollEnabled;
    self.webView.scrollView.pagingEnabled = self.pagingEnabled;
    self.webView.scrollView.bounces = self.bounces;
    self.webView.scrollView.showsHorizontalScrollIndicator = self.showsHorizontalScrollIndicator;
    self.webView.scrollView.showsVerticalScrollIndicator = self.showsVerticalScrollIndicator;
    self.webView.allowsLinkPreview = self.allowsLinkPreview;
    [self.webView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew context:nil];
    self.webView.allowsBackForwardNavigationGestures = self.allowsBackForwardNavigationGestures;
    
    if (self.userAgent) {
      self.webView.customUserAgent = self.userAgent;
    }
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 110000 /* __IPHONE_11_0 */
    if ([self.webView.scrollView respondsToSelector:@selector(setContentInsetAdjustmentBehavior:)]) {
      self.webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
#endif
    
    [self addSubview:self.webView];
  }
}

@end
