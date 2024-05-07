import bycrypt from "bcrypt"
export class Password {
  async compare(password: string, passwordHash: string) {
    return await bycrypt.compare(password, passwordHash)
  }
  async create(password: string) {
    const passwordHash = await bycrypt.hash(password, process.env.BCRYPT_ROUND!)
    return passwordHash
  }
}