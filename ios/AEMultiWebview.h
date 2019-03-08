#import <React/RCTDefines.h>
#import "RNCWKWebView.h"
#import "RNCWKProcessPoolManager.h"

@class AEMultiWebView;

@protocol AEWKWebViewDelegate <RNCWKWebViewDelegate>

- (WKWebView *)        webView:(AEMultiWebView *)webView
createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration
                    forRequest:(NSMutableDictionary<NSString *, id> *)request
                  withCallback:(RCTDirectEventBlock)callback;

- (UIView *)view;

- (WKWebView*) removeWebViewWithIdentifier:(NSInteger)lockIdentifier;
- (void) addWebView:(WKWebView *)webView withIdentifier:(NSInteger)lockIdentifier;

@end

@interface AEMultiWebView : RNCWKWebView

@property (nonatomic, weak) id<AEWKWebViewDelegate> delegate;
@property (nonatomic, assign) NSInteger premadeWebViewIdentifier;

- (void)visitSource;

@end
