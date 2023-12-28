import UserModel from '../models/user.model';

export default class UserController
{
  async getDetail(req:any, res:any) {
    try {
      const userModel = new UserModel;
      const userDetail = await userModel.customerDetail(req.data.email);
      if(!userDetail) throw new Error("Not Found");
      delete(userDetail.password);
      return res.json(userDetail);
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
}
