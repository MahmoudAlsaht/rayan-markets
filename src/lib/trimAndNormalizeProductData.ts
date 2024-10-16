"use server";

export async function trimAndNormalizeProductData(
  dataToModify: any | string,
): Promise<any | string> {
  if (typeof dataToModify === "string")
    return dataToModify.trim().replace(/\s+/g, " ");
  return {
    ...dataToModify,
    name: dataToModify.name.trim().replace(/\s+/g, " "),
    body: dataToModify.body.trim().replace(/\s+/g, " "),
    category: dataToModify.category?.trim().replace(/\s+/g, " "),
    brand: dataToModify.brand?.trim().replace(/\s+/g, " "),
  };
}
