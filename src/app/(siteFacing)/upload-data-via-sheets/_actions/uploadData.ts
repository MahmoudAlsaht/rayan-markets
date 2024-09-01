"use server";
import db from "@/db/db";
import { fetchAndUploadImage } from "./uploadImages";

type Data = {
  name: string;
  body: string;
  price?: string;
  newPrice?: string;
  quantity?: string;
  category?: string;
  brand?: string;
  productType?: string;
  options?: string;
  offerStartsAt?: string;
  offerEndsAt?: string;
  productImage: string;
  brandImage?: string;
  categoryImage?: string;
  description?: string;
};

const cloudImages = [
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201456/Test%20images/xlcbixz3yf52y6u9d8nb.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201455/Test%20images/hhnnsuzq6hwlt2ue7krb.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201455/Test%20images/tofunqoc8mnv9bkwx4jk.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201454/Test%20images/yowctmsr0rb4uatoylki.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201454/Test%20images/guobcritzvvclpbcbbin.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201454/Test%20images/ihsyqvwbkqv9kgmu5glv.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/epdfle4zgewrt0eed6bm.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/m5o3fqdo053tttnd1azl.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/ny2ocpwceyei6r9mobmy.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201454/Test%20images/ihsyqvwbkqv9kgmu5glv.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/epdfle4zgewrt0eed6bm.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/m5o3fqdo053tttnd1azl.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/m4nlizipjuhdpxqtxaow.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/y1hax9eory7erjmjuxks.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/pjlqjhkm4bkjoednsqko.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201453/Test%20images/ny2ocpwceyei6r9mobmy.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201449/Test%20images/csymnsufnfjstik0bk9z.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201450/Test%20images/nri5umywcabflq9cshes.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/wjy8m5zj9xwe38izo6an.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/wjy8m5zj9xwe38izo6an.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/ubw1m5hvodphzescfmbi.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201449/Test%20images/csymnsufnfjstik0bk9z.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201450/Test%20images/nri5umywcabflq9cshes.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/wjy8m5zj9xwe38izo6an.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201451/Test%20images/ubw1m5hvodphzescfmbi.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201448/Test%20images/dejwefl2nihi5q4ye4nm.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201448/Test%20images/eslwduwxv7afnyu6kk9o.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201448/Test%20images/o7ydvclhk4hwyonqq6yf.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201449/Test%20images/du2g00x8ycmi5l0exqwq.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201447/Test%20images/toludcmvomxdd6kzpfbl.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201447/Test%20images/qho5ysts8ku4lowupehs.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201446/Test%20images/zheh4pgqrqbbj3jnckvi.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201446/Test%20images/idib1wrrvpnnpchmy82g.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201444/Test%20images/okzucdeyi6stzpkhpjoq.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201445/Test%20images/isn8u8be4fysjvixx6oe.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201445/Test%20images/mdocea8fwlbqvowjbbrk.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201446/Test%20images/u413z3ascsvs28lr6edf.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201444/Test%20images/xk7jmeu5ezbphjaet2qn.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201444/Test%20images/jv8yigzwxmtrjb4wemt5.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201444/Test%20images/lsr6pnjavfsoz1c3ftrc.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201443/Test%20images/xu7z1pqadnwrctvuqyog.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/i8buqhgca2b4utjnq5kd.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/xaxe82melinjlgpkbujv.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201442/Test%20images/yjxbbuzjbgvvcbjromt3.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201443/Test%20images/ijocrr5kewd11slm5kwd.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/pvdfg0clbtm5mj8gu9mb.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/jmjc6vrylpekwcsfy8vp.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/haqfja5iix71llcavqhw.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201441/Test%20images/rim89c6idkymjalapjoe.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201438/Test%20images/gkci2rdui6pb9ikpjoaj.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201438/Test%20images/yptj2eaakjzywg8v1kia.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201438/Test%20images/gkci2rdui6pb9ikpjoaj.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201438/Test%20images/ok1cg45yq5yovljssbht.png",
  "https://res.cloudinary.com/itsformemahmoud2097/image/upload/v1725201438/Test%20images/ok1cg45yq5yovljssbht.png",
];

function randomize(arr) {
  return Math.floor(Math.random() * arr.length + 1);
}

export async function generateData(fileData: any[]) {
  const data: Data[] = fileData;

  try {
    for (let i = 0; i < 1000; i++) {
      await generateProduct({
        ...data[randomize(data)],
        productImage: cloudImages[randomize(cloudImages)],
        brandImage: cloudImages[randomize(cloudImages)],
        categoryImage: cloudImages[randomize(cloudImages)],
      });
    }
    // for (const item of data) {
    //   if (item.name && item.name !== "" && !(await findProduct(item.name))) {
    //     await generateProduct({ ...item });
    //   }
    // }
  } catch (e) {
    console.log(e);
  }
}

async function generateSection(name: string, image: string, type: string) {
  if (!image || !name || !type) return null;
  const { path, filename } = await fetchAndUploadImage(image);
  if (!path || !filename) return null;

  return await db.section.create({
    data: {
      name,
      type,
      cover: {
        create: {
          imageType: "SectionCover",
          filename,
          path,
        },
      },
    },
  });
}

async function findSection(name: string, type: string) {
  return await db.section.findFirst({
    where: {
      AND: [{ name }, { type }],
    },
  });
}

async function findProduct(name: string) {
  return await db.product.findFirst({
    where: {
      AND: [{ name }],
    },
  });
}

async function generateProduct(product: Data) {
  try {
    const category =
      // (product.category &&
      //   product.category !== "" &&
      //   (await findSection(product.category, "categories"))) ||
      product.category &&
      product.categoryImage &&
      (await generateSection(
        product.category,
        product.categoryImage,
        "categories",
      ));
    const brand =
      // (product.brand &&
      //   product.brand !== "" &&
      //   (await findSection(product.brand, "brands"))) ||
      product.brand &&
      product.brandImage &&
      (await generateSection(product.brand, product.brandImage, "brands"));

    const { path, filename } = await fetchAndUploadImage(product.productImage);

    const newImage = await db.image.create({
      data: {
        imageType: "ProductImage",
        filename,
        path,
      },
    });

    await db.product.create({
      data: {
        imageId: newImage.id,
        name: product.name,
        body: product.body,
        brandId: brand && brand?.id,
        categoryId: category && category?.id,
        productType:
          !product.productType && product.productType === ""
            ? "normal"
            : product.productType,
        price:
          product.price && product.price === ""
            ? 1.0
            : parseFloat(parseFloat(product.price || "1").toFixed(2)),
        isOffer: product.offerStartsAt != null && product.offerEndsAt != null,
        newPrice:
          !product.newPrice && product.newPrice === ""
            ? undefined
            : parseFloat(parseFloat(product.newPrice || "0").toFixed(2)),
        quantity:
          product.quantity && product.quantity === ""
            ? 100
            : parseInt(product.quantity || "100"),
        offerStartsAt: product.offerStartsAt,
        offerEndsAt: product.offerEndsAt,
        description: product.description,
        weights:
          product.productType === "weight" && product.options
            ? product.options.split("/").map((w) => parseFloat(w))
            : undefined,
        flavors:
          product.productType === "flavor" && product.options
            ? product.options.split("/")
            : undefined,
      },
    });
  } catch (e: any) {
    e.message;
  }
}
