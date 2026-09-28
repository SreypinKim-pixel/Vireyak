import AuthForm from "../../components/AuthForm";
export const metadata = {
  robots: { index: false, follow: true },
  title: "Welcome back",
};
export default function LoginPage() {
  return <AuthForm />;
}
