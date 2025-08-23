import PasswordChangeForm from "./PasswordChangeForm.jsx";
import EditUserInfoForm from "./EditUserInfoForm.jsx";

const UserForm = () => {
  return (
    <section className="container py-4">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-6">
          <PasswordChangeForm />
        </div>
        <div className="col-12 col-lg-6">
          <EditUserInfoForm />
        </div>
      </div>
    </section>
  );
};

export default UserForm;