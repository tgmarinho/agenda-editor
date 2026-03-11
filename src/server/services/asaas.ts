const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL ?? 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY ?? '';

export async function createPixCharge(params: {
  customer: string;
  value: number;
  description: string;
  externalReference?: string;
}) {
  const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify({
      ...params,
      billingType: 'PIX',
    }),
  });

  if (!response.ok) {
    throw new Error(`Asaas API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getPixQrCode(paymentId: string) {
  const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}/pixQrCode`, {
    headers: {
      access_token: ASAAS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Asaas API error: ${response.statusText}`);
  }

  return response.json();
}
