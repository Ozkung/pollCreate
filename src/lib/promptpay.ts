// Builds a Thai PromptPay QR payload (EMVCo merchant-presented QR, BOT spec).

const PROMPTPAY_AID = "A000000677010111";

function field(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

function crc16(data: string): string {
  // CRC-16/CCITT-FALSE: poly 0x1021, init 0xFFFF.
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Returns the account field for a phone number, national/tax ID or e-wallet ID. */
function accountField(id: string): string {
  const digits = id.replace(/\D/g, "");
  if (digits.length === 15) return field("03", digits);
  if (digits.length === 13) return field("02", digits);
  if (digits.length === 10 && digits.startsWith("0")) {
    return field("01", "0066" + digits.slice(1));
  }
  throw new Error(`Invalid PromptPay ID: expected a phone number, 13-digit ID or 15-digit e-wallet ID`);
}

export function promptPayPayload(id: string, amount?: number): string {
  const payload =
    field("00", "01") +
    field("01", amount ? "12" : "11") +
    field("29", field("00", PROMPTPAY_AID) + accountField(id)) +
    field("58", "TH") +
    field("53", "764") +
    (amount ? field("54", amount.toFixed(2)) : "") +
    "6304";
  return payload + crc16(payload);
}
