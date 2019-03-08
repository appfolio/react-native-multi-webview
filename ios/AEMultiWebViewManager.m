#import "AEMultiWebViewManager.h"
#import "AEMultiWebView.h"

@interface AEMultiWebViewManager () <AEWKWebViewDelegate>

@end

@implementation AEMultiWebViewManager
{
  NSMutableDictionary<NSNumber*, WKWebView *> *_webviews;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  AEMultiWebView *webView = [[AEMultiWebView alloc] init];
  webView.delegate = self;
  return webView;
}

RCT_EXPORT_VIEW_PROPERTY(onCreateWebView, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(premadeWebViewIdentifier, NSInteger)

- (void) addWebView:(WKWebView *)webView withIdentifier:(NSInteger)lockIdentifier
{
  if (_webviews == nil) {
    _webviews = [[NSMutableDictionary alloc] init];
  }
  
  [_webviews setObject:webView forKey:[NSNumber numberWithInteger:lockIdentifier]];
}

- (WKWebView*) removeWebViewWithIdentifier:(NSInteger)lockIdentifier
{
  if (_webviews == nil) {
    return nil;
  }
  
  NSNumber *key = [NSNumber numberWithInteger:lockIdentifier];
  WKWebView *webView = [_webviews objectForKey:key];
  [_webviews removeObjectForKey:key];
  return webView;
}


@end
