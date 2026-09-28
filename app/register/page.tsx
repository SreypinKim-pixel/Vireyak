import AuthForm from "../../components/AuthForm";
export const metadata = {
  robots: { index: false, follow: true },
  title: "Start your journey",
};
export default function RegisterPage() {
  return <AuthForm register />;
}
