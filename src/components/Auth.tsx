import * as z from 'zod';
import { Link } from '@tanstack/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Logo from '../components/Logo';
import GitHubIcon from '@mui/icons-material/GitHub';
import supabase from '@/supabase';
import { useEffect } from 'react';
//   const { data, error } = await supabase.auth.signUp(values);

type Props = { type: 'signin' | 'signup' };
const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
});

export default function Auth({ type }: Props) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword(values);
    }
    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp(values);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Card className="max-w-sm w-full self-stretch mx-auto xs:outline outline-1 outline-neutral-300 dark:outline-neutral-800">
        <CardHeader className="flex flex-row items-center mb-4 gap-4">
          <Logo short />
          <CardTitle>
            Welcome to <Link to="/">Thullo</Link>!
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Sign in using</p>
            <Button
              className="bg-blue-500 hover:bg-blue-700"
              onClick={async () => {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: import.meta.env.VITE_DEMO_EMAIL,
                  password: import.meta.env.VITE_DEMO_PASSWORD,
                });
              }}
            >
              Demo Account
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const { data, error } = await supabase.auth.signInWithOAuth({
                  provider: 'github',
                });
              }}
            >
              <GitHubIcon className="mr-2" />
              Github
            </Button>
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs">
                  {type === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  {type === 'signin' ? (
                    <Link to="/signup" className="text-blue-500 hover:underline">
                      Sign Up
                    </Link>
                  ) : (
                    <Link to="/signin" className="text-blue-500 hover:underline">
                      Sign In
                    </Link>
                  )}
                </p>
                <Button type="submit" variant="secondary">
                  {type === 'signin' ? 'Sign In' : 'Sign Up'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
