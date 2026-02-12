export default function generateOrderId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `H2O-${randomNum}`;
}