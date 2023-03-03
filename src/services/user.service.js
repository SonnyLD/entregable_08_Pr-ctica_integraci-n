import UserModel from "../dao/models/users.models.js";
import cartServices from"./carts.services.js"
import bcrypt from 'bcrypt'

export async function createUser(user) {
    try {
      const userExists = await UserModel.findOne({ email: user.email }).lean();

      if (userExists) {
        throw new Error('User already exists')
      }
      const newCart = await cartServices.createCart();

      user.password = await bcrypt.hash(user.password, 8)

      const createdUser = await UserModel.create({ ...user, cart: newCart._id });

      return createdUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

  export async function getUser(email) {
    try {
      const users = await UserModel.findOne({ email }).populate({
        path: 'cart',
        populate: {
          path: 'products.product'
        }
      }).lean()
      if (!users) {
        throw new Error('User not found')
      }
      return users
    } catch (error) {
      throw new Error(error.message)
    }
  }
  export async function getUserById(id) {
    try {
      const user = await UserModel.findById(id).populate({
        path: 'cart',
        populate: {
          path: 'products.product'
        }
      }).lean()
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }

export async function updateUser(email, data, updatePassword = false) {
  try {
    const user = await getUser(email);
    if (user) {
      if (data.password) {
        if (updatePassword) {
          data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        } else {
          delete data.password;
        }
      }
      const user = await UserModel.findOneAndUpdate({ email }, { ...data }, { new: true });
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
