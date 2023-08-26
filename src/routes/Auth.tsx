import Logo from '../components/Logo';

//   const { data, error } = await supabase.auth.signUp(values);
//   const { data, error } = await supabase.auth.signInWithPassword(values);

export default function Auth() {
  return (
    <form className="p-6 max-w-sm flex flex-col gap-4 rounded outline outline-1 outline-neutral-500">
      <Logo short />
      <p className="text-xl font-bold">Welcome to Thello!</p>
      <p>Login using</p>
      <p>Github</p>
      <p>or</p>

      <input type="email" placeholder="johndoe@gmail.com" required />
      <input type="password" placeholder="Your Password" required />
      <button type="submit" className="bg-primary">
        Login
      </button>
    </form>
  );
}
