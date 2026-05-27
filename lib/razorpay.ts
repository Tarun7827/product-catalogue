const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Dynamically injects the Razorpay checkout script only when called.
 * Safe to call multiple times — the script is only ever appended once.
 *
 * Usage: await loadRazorpay() just before opening the payment modal.
 */
export function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(RAZORPAY_SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });
}
