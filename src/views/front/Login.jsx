import axios from "axios";
import { useForm } from "react-hook-form";
import { emailValidation } from "../../utils/validation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      alert("登入成功");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return (
    <div className="container p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            帳號
          </label>
          <input type="email" name="username" className="form-control" id="userName" aria-describedby="userName" placeholder="email" {...register("username", emailValidation)} />
          {errors.username && <p className="text-danger">{errors.username.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            密碼
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            placeholder="password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼長度至少需 6 碼",
              },
            })}
          />
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
