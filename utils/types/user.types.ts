interface IUser {
  UserID: number;
  LastName: string;
  FirstName: string;
  MiddleName: string;
  Birthday: string;
  Age: number;
  ContactNumber: string;
  Email: string;
  Address: string;
  Height: number;
  Weight: number;
  Username: string;
  Password: string;
  ConfirmPassword: string;
  ProfilePic: string;
  SubscriptionType: string;
  Gender: string;
  RFIDNumber?: string;
  Activation?: string;
}
export default IUser;
