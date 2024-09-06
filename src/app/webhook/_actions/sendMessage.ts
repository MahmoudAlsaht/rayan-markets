import axios from "axios";

const { WHATSAPP_VERSION, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } =
  process.env;

export const sendVerificationCode = async (
  verificationCode: string,
  recipient: string,
) => {
  try {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      preview_url: false,
      recipient_type: "individual",
      to: `+962${recipient.slice(1)}`,
      type: "text",
      text: {
        body: `Your verification code is: ${verificationCode}`,
      },
    });

    await sendMessage(data);
  } catch (e: any) {
    console.error(e);
  }
};

async function sendMessage(data) {
  const config = {
    method: "post",
    url: `https://graph.facebook.com/${WHATSAPP_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data,
  };
  return await axios(config);
}
