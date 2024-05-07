interface CalculateDiscount {
  price: number;
  discount: number;
  quantity: number;
}
export function CalculateDiscount(params: CalculateDiscount) {
  let { price, discount = 0.0, quantity = 1 } = params;

  const totalWithoutDiscount = price * quantity;
  const discountAmount =
    (totalWithoutDiscount * parseFloat(discount.toFixed(2))) / 100;
  const totalWithDiscount = totalWithoutDiscount - discountAmount;
  return totalWithDiscount;
}
