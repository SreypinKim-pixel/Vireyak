import AuthForm from "../../components/AuthForm";
export const metadata = {
  robots: { index: false, follow: true },
  title: "Log in",
};
export default function LoginPage() {
  return <AuthForm />;
}
