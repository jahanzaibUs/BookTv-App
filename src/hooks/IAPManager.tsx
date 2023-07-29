import React, { useEffect } from "react";
import { Platform } from "react-native";
import RNIap, {
  InAppPurchase,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  withIAPContext,
} from "react-native-iap";
import crashlytics from "@react-native-firebase/crashlytics";

import { postPurchase } from "@data-fetch/subscription";

export const processNewPurchase = async (
  purchase: ProductPurchase | SubscriptionPurchase,
  extraData?: any
): Promise<any> => {
  console.log(purchase);
  const { productId, transactionId } = purchase;

  let body: any = {
    platform: Platform.OS,
    productId: productId,
    orderId: transactionId,
  };

  if (extraData) {
    body = { ...body, ...extraData };
  }

  // iOS specific properties
  // originalOrderId, originalPurchaseTime, transactionReceipt are all iOS specific
  if (Platform.OS === "ios") {
    body["receipt"] = purchase["transactionReceipt"];
  }

  // Android specific properties
  // packageName, purchaseToken are all Android specific
  if (Platform.OS === "android") {
    body["packageName"] = purchase["packageNameAndroid"];
    body["purchaseToken"] = purchase["purchaseToken"];
  }

  try {
    // record transaction in server
    return await postPurchase(body);
  } catch (e) {
    return { success: false };
  }
};

const IAPManagerWrapped = (props: any) => {
  let purchaseUpdateSubscription: any = null;
  let purchaseErrorSubscription: any = null;

  // handle Android "Not initialized"
  const handleConnection = async () => {
    const inited = await RNIap.initConnection();
    console.log("initConnection", inited);
  };

  useEffect(() => {
    try {
      handleConnection();

      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (
          purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase
        ) => {
          console.log("purchaseUpdatedListener", purchase);
          crashlytics().log(JSON.stringify(purchase));

          const receipt = purchase.transactionReceipt;

          if (receipt) {
            // Only consumable can be purchased again
            let isConsumable = false;
            if (purchase.productId.toLowerCase().includes("lesson")) {
              isConsumable = true;
            }
            // Enable repeated purchase for testing
            if (__DEV__) {
              isConsumable = true;
            }
            // Tell the store that you have delivered what has been paid for.
            // Failure to do this will result in the purchase being refunded on Android and
            // the purchase event will reappear on every relaunch of the app until you succeed
            // in doing the below. It will also be impossible for the user to purchase consumables
            // again until you do
            await RNIap.finishTransaction(purchase, isConsumable);
            console.log(
              "finishTransaction - " + isConsumable
                ? "consumable"
                : "non-consumable"
            );
          } else {
            // Retry / conclude the purchase is fraudulent, etc...
          }
        }
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.warn("purchaseErrorListener", error);
        }
      );

      return () => {
        if (purchaseUpdateSubscription) {
          purchaseUpdateSubscription.remove();
          purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
          purchaseErrorSubscription.remove();
          purchaseErrorSubscription = null;
        }
      };
    } catch (err: any) {
      console.error(err);
      crashlytics().recordError(err);
    }
  }, []);

  return <>{props.children}</>;
};

export default withIAPContext(IAPManagerWrapped);
