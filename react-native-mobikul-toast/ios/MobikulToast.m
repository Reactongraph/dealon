#import "MobikulToast.h"
#import <UIKit/UIKit.h>
#import "UIView+Toast.h"

#define UIColorFromRGB(rgbHex) [UIColor colorWithRed:((float)((rgbHex & 0xFF0000) >> 16))/255.0 green:((float)((rgbHex & 0xFF00) >> 8))/255.0 blue:((float)(rgbHex & 0xFF))/255.0 alpha:1.0]

NSInteger const MobikulBottomOffset = 40;
double const MobikulShortDuration = 3.0;
double const MobikulLongDuration = 5.0;
NSInteger const MobikulGravityBottom = 1;
NSInteger const MobikulGravityCenter = 2;
NSInteger const MobikulGravityTop = 3;

@implementation MobikulToast{
     CGFloat _keyOffset;
}

- (instancetype)init {
    if (self = [super init]) {
        _keyOffset = 0;
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(keyboardDidShow:)
                                                     name:UIKeyboardDidShowNotification
                                                   object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(keyboardWillHide:)
                                                     name:UIKeyboardWillHideNotification
                                                   object:nil];
    }
    return self;
}

- (void)keyboardDidShow:(NSNotification *)notification {
    CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    
    int height = MIN(keyboardSize.height, keyboardSize.width);
  
    _keyOffset = height;
}

- (void)keyboardWillHide:(NSNotification *)notification {
    _keyOffset = 0;
}

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
    return @{
             @"SHORT": [NSNumber numberWithDouble:MobikulShortDuration],
             @"LONG": [NSNumber numberWithDouble:MobikulLongDuration],
             @"BOTTOM": [NSNumber numberWithInteger:MobikulGravityBottom],
             @"CENTER": [NSNumber numberWithInteger:MobikulGravityCenter],
             @"TOP": [NSNumber numberWithInteger:MobikulGravityTop]
             };
}

RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
{
    // TODO: Implement some actually useful functionality
	callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument]]);
}
RCT_EXPORT_METHOD(show:(NSString *)msg duration:(double)duration {
    
    [self _show:msg duration:duration gravity:MobikulGravityBottom backgroundColor:nil];
});

RCT_EXPORT_METHOD(error:(NSString *)msg duration:(double)duration {
    
    [self _show:msg duration:duration gravity:MobikulGravityBottom backgroundColor:UIColorFromRGB(0xFF4500)];
});

RCT_EXPORT_METHOD(success:(NSString *)msg duration:(double)duration {
    
    [self _show:msg duration:duration gravity:MobikulGravityBottom backgroundColor:UIColorFromRGB(0x228B22)];
});

RCT_EXPORT_METHOD(warning:(NSString *)msg duration:(double)duration {
    
    [self _show:msg duration:duration gravity:MobikulGravityBottom backgroundColor:UIColorFromRGB(0xD4AF37)];
});


- (UIViewController *)visibleViewController:(UIViewController *)rootViewController
{
    if (rootViewController.presentedViewController == nil)
    {
        return rootViewController;
    }
    if ([rootViewController.presentedViewController isKindOfClass:[UINavigationController class]])
    {
        UINavigationController *navigationController = (UINavigationController *)rootViewController.presentedViewController;
        UIViewController *lastViewController = [[navigationController viewControllers] lastObject];
        
        return [self visibleViewController:lastViewController];
    }
    if ([rootViewController.presentedViewController isKindOfClass:[UITabBarController class]])
    {
        UITabBarController *tabBarController = (UITabBarController *)rootViewController.presentedViewController;
        UIViewController *selectedViewController = tabBarController.selectedViewController;
        
        return [self visibleViewController:selectedViewController];
    }
    
    UIViewController *presentedViewController = (UIViewController *)rootViewController.presentedViewController;
    
    return [self visibleViewController:presentedViewController];
}


- (void)_show:(NSString *)msg duration:(NSTimeInterval)duration gravity:(NSInteger)gravity backgroundColor:(UIColor *)backgroundColor {
    dispatch_async(dispatch_get_main_queue(), ^{
        //UIView *root = [[[[[UIApplication sharedApplication] delegate] window] rootViewController] view];
        UIViewController *ctrl = [self visibleViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
        UIView *root = [ctrl view];
        CGRect bound = root.bounds;
        bound.size.height -= _keyOffset;
        if (bound.size.height > MobikulBottomOffset*2) {
            bound.origin.y += MobikulBottomOffset;
            bound.size.height -= MobikulBottomOffset*2;
        }
        UIView *view = [[UIView alloc] initWithFrame:bound];
        view.userInteractionEnabled = NO;
        [root addSubview:view];
        UIView __weak *blockView = view;
        id position;
        if (gravity == MobikulGravityTop) {
            position = CSToastPositionTop;
        } else if (gravity == MobikulGravityCenter) {
            position = CSToastPositionCenter;
        } else {
            position = CSToastPositionBottom;
        }
        CSToastStyle *style = [[CSToastStyle alloc] initWithDefaultStyle];
        style.backgroundColor = backgroundColor;
        UIImage *img = [UIImage imageNamed: @"toastimage"];
        [view makeToast:msg
            duration:duration
            position:position
            title:nil
            image:img
            style:style
            completion:^(BOOL didTap) {
                [blockView removeFromSuperview];
            }];
    });
}
@end
