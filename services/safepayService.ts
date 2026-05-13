import axios from "axios";

const SAFEPAY_SETTINGS = {
  sandbox: {
    apiKey: process.env.EXPO_PUBLIC_SAFEPAY_API_KEY,
    baseUrl: "https://sandbox.api.getsafepay.com",
    checkoutUrl: "https://sandbox.api.getsafepay.com/checkout",
  },
};
console.log(
  "PUBLIC_SAFEPAY_API_KEY :",
  process.env.EXPO_PUBLIC_SAFEPAY_API_KEY,
);

type SafepayResponse =
  | {
      success: true;
      url: string;
    }
  | {
      success: false;
      error: string;
    };

export const createSafepayOrder = async (
  amount: number,
): Promise<SafepayResponse> => {
  try {
    const response = await axios.post(
      `${SAFEPAY_SETTINGS.sandbox.baseUrl}/order/v1/init`,
      {
        client: SAFEPAY_SETTINGS.sandbox.apiKey,
        amount: Number(amount),
        currency: "PKR",
        order_id: "ORDER_" + Date.now(),
        environment: "sandbox",
        intent: "sale",
        billing: {
          name: "Test User",
          email: "test@example.com",
          phone: "03001234567",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(
      "Full SafePay Response:",
      JSON.stringify(response.data, null, 2),
    );

    const token = response.data?.data?.token;
    console.log("Token : ", token);

    if (token) {
      return {
        success: true,
        url: `${SAFEPAY_SETTINGS.sandbox.checkoutUrl}/${token}`,
      };
    }

    return {
      success: false,
      error: "SafePay token not found",
    };
  } catch (error: any) {
    console.log("SafePay Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
