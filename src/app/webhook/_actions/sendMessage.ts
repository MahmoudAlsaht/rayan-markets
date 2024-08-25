import axios from "axios";

const {
  WHATSAPP_VERSION,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_RECIPIENT_WAID,
  WHATSAPP_ACCESS_TOKEN,
} = process.env;

export const sendVerificationCode = async (
  verificationCode: string,
  recipient = WHATSAPP_RECIPIENT_WAID,
) => {
  try {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      preview_url: false,
      recipient_type: "individual",
      to: recipient,
      type: "text",
      text: {
        body: `Your verification code is: ${verificationCode}`,
      },
    });

    const res = await sendMessage(data);
  } catch (e: any) {
    console.error(e);
  }
};

async function sendMessage(data) {
  const config = {
    method: "POST",
    url: `https://graph.facebook.com/${WHATSAPP_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data,
  };
  return await axios(config);
}
