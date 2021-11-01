import Realm from "realm";
import AppConstant from "../app_constant/AppConstant";
import { resolve } from "url";

export const HOME_PAGE_DATA = "HOME_PAGE_DATA";
export const PRODUCT_PAGE_DATA = "PRODUCT_PAGE_DATA";
export const CATEGORY_PAGE_DATA = "CATEGORY_PAGE_DATA";
export const SEARCH_CATEGORY_PAGE_DATA = "SEARCH_CATEGORY_PAGE_DATA";

export const OFFLINE_CART = "OFFLINE_CART"

export const NOTIFICATION_DATA = "NOTIFICATION_DATA"


// Define Models and properties

export const NotificationSchema ={
  name:NOTIFICATION_DATA,
  primaryKey : "id",
  properties :{
    id : "int"
  }
}

export const HomePageSchema = {
  name: HOME_PAGE_DATA,
  primaryKey : "id",
  properties: {
    homePageData: "string",
    id: "int",
  }
};

export const ProductPageSchema = {
  name: PRODUCT_PAGE_DATA,
  primaryKey: "id",
  properties: {
    id: "int",
    productPageData: "string"
  }
};

export const CategoryPageSchema = {
  name: CATEGORY_PAGE_DATA,
  primaryKey: "id",
  properties: {
    id: "int",
    categoryPageData: "string"
  }
};

export const CategorySearchPageSchema = {
  name: SEARCH_CATEGORY_PAGE_DATA,
  primaryKey: "search",
  properties: {
    search: "string",
    categorySearchPageData: "string"
  }
};

export const OfflineCartSchema ={
  name:OFFLINE_CART,
  primaryKey : "composite_key",
  properties:{
    composite_key : "string",
    product_id : "int",
    quantity : "int",
    variation_id :"int",
    variations :{ type: "string", default: "" },
    customer_id :{ type: "string", default: "" },
    guest_id : { type: "string", default: "" }
  }
}


////////////////////////////// Functions /////////////////////////////////////////////////////////

export const databaseOption = {
  path:AppConstant.APP_NAME,
  schema: [
    HomePageSchema,
    ProductPageSchema,
    CategoryPageSchema,
    CategorySearchPageSchema,
    OfflineCartSchema,
    NotificationSchema
  ],
  schemaVersion: 3,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion > 1) {
      // newRealm = oldRealm;
    }
  }
};

//////////////////////// HOME PAGE ///////////////////////////
export const insertHomePageData = homePageData =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {   
        realm.write(() => {
          realm.create(HOME_PAGE_DATA, homePageData, true)
        });
      })
      .catch(error => {
        console.error("AllSchemas.insertHomePageData=>>>", error);
      });
  });

export const getHomePageData = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        let data = realm.objectForPrimaryKey(HOME_PAGE_DATA, 1);
        if (data && data.homePageData) {          
          resolve(JSON.parse(data.homePageData));
        } else {
          reject("Home Page Data Not Found");
        }
      })
      .catch(error => {
        console.log("AllSchemas.getHomePageData=>>>", error);
        reject("Home Page Data Not Found");
      });
  });

  //////////////////////// PRODUCT PAGE ///////////////////////////

  export const insertProductPageData = productPageData =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {   
        realm.write(() => {
          realm.create(PRODUCT_PAGE_DATA, productPageData, true);
        });
      })
      .catch(error => {
        console.log("AllSchemas.insertProductPageData=>>>", error);
      });
  });

export const getProductPageData = (productId) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        let data = realm.objectForPrimaryKey(PRODUCT_PAGE_DATA, productId);
        if (data && data.productPageData) {
          resolve(JSON.parse(data.productPageData));
        } else {
          reject("PRODUCT_PAGE_DATA Not Found");
        }
      })
      .catch(error => {
        console.log("AllSchemas.getProductPageData=>>>", error);
        reject("PRODUCT_PAGE_DATA Not Found");
      });
  });

  //////////////////////// CATEGORY PAGE ///////////////////////////

  export const insertCategoryPageData = categoryPageData =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {   
        realm.write(() => {
          realm.create(CATEGORY_PAGE_DATA, categoryPageData, true)
        });
      })
      .catch(error => {
        console.error("AllSchemas.insertCategoryPageData=>>>", error);
      });
  });

export const getCategoryPageData = (categoryId) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        let data = realm.objectForPrimaryKey(CATEGORY_PAGE_DATA, categoryId);
        if (data && data.categoryPageData) {
          resolve(JSON.parse(data.categoryPageData));
        } else {
          reject("CATEGORY_PAGE_DATA Not Found");
        }
      })
      .catch(error => {
        console.log("AllSchemas.getCategoryPageData=>>>", error);
        reject("CATEGORY_PAGE_DATA Not Found");
      });
  });

  //////////////////////// CATEGORY PRODUCT SEARCH PAGE ///////////////////////////

export const insertCategoryProductSerachPageData = categorySearchProductData =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {   
        realm.write(() => {
          realm.create(SEARCH_CATEGORY_PAGE_DATA, categorySearchProductData, true)
        });
      })
      .catch(error => {
        console.error("AllSchemas.insertCategoryPageData=>>>", error);
      });
  });

export const getCategorySearchProductPageData = (search) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        let data = realm.objectForPrimaryKey(SEARCH_CATEGORY_PAGE_DATA, search);
        if (data && data.categorySearchPageData) {
          resolve(JSON.parse(data.categorySearchPageData));
        } else {
          reject("SEARCH_CATEGORY_PAGE_DATA Not Found");
        }
      })
      .catch(error => {
        console.log("AllSchemas.getCategorySearchProductPageData=>>>", error);
        reject("SEARCH_CATEGORY_PAGE_DATA Not Found");
      });
  });


  /////////////////////////////  OFFLINE_CART /////////////////////////////////////

  export const insertProductInCart = (cart)=>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        realm.write(() => {
          let data = realm.objectForPrimaryKey(OFFLINE_CART, cart.composite_key);
          if (data && data.composite_key == cart.composite_key) {
            data.quantity = data.quantity + cart.quantity; 
          } else {
            realm.create(OFFLINE_CART, cart, true)
          }
          resolve(true);
        });
      })
      .catch(error => {
        resolve(false);
        console.error("AllSchemas.insertProductInCart=>>>", error);
      });
  });

  export const insertAllProductInCart = (carts)=>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        realm.write(() => {
          carts.forEach(cart => {
          let data = realm.objectForPrimaryKey(OFFLINE_CART, cart.composite_key);
          console.log("data=>>>", data);
          
          if (data && data.composite_key == cart.composite_key) {
            data.quantity = data.quantity + cart.quantity; 
          } else {
            realm.create(OFFLINE_CART, cart, true)
          }
        })
          resolve(true);
        });
      })
      .catch(error => {
        resolve(false);
        console.error("AllSchemas.insertProductInCart=>>>", error);
      });
  });

  export const getAllOfflineCart = (cartId) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
      .then(realm => {
        let data = realm.objects(OFFLINE_CART);
        if (data) {
          let cartData = JSON.parse(JSON.stringify(data));
          cartData = Object.values(cartData)
          resolve(cartData);
        } else {
          reject("No Offline CART_DATA Found");
        }
      })
      .catch(error => {
        console.log("AllSchemas.getAllCart=>>>", error);
        reject("No Offline CART_DATA Found");
      });
  });

  export const removeAllCart = ()=>
  new Promise((resolve, reject) => {
    Realm.open(databaseOption)
    .then(realm => {
      realm.write(() => {
        realm.delete(realm.objects(OFFLINE_CART ));
        resolve(true);
      });
    })
    .catch(error =>{
         console.log("AllSchema.removeAllCart", error); 
         resolve(false);
    } );
  })

  export const addNotofication =(id)=> new Promise((resolve, reject)=>{
    Realm.open(databaseOption)
    .then(realm=>{
      realm.write(()=>{
        realm.create(NOTIFICATION_DATA, {id:id}, true)
      })
    })
  })
  export const deleteNotofication =(id)=> new Promise((resolve, reject)=>{
    Realm.open(databaseOption)
    .then(realm=>{
      realm.write(()=>{
        realm.delete(realm.objectForPrimaryKey(NOTIFICATION_DATA, id,))
      })
    })
  })

  export const getAllNotification = ()=>new Promise((resolve, reject)=>{
    Realm.open(databaseOption).then( realm=>{
      let objects = realm.objects(NOTIFICATION_DATA);
      objects = JSON.parse(JSON.stringify(objects));
      resolve(objects)
    })

  })