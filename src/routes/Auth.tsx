import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core';
import supabase from '../supabase';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Auth(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder className="max-w-md bg-neutral-900" {...props}>
      <Text size="lg" weight={500}>
        {upperFirst(type)}
      </Text>
      <Group grow mb="md" mt="md">
        <button className="outline outline-1 outline-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded p-2 flex gap-1.5 justify-center items-center">
          <GoogleIcon />
          Google
        </button>
        <button className="outline outline-1 outline-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded p-2 flex gap-1.5 justify-center items-center">
          <GitHubIcon />
          Github
        </button>
      </Group>
      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(async (values) => {
          if (type === 'register') {
            const { data, error } = await supabase.auth.signUp(values);
            console.log('data from signUp()', data);
            if (error) console.log(error);
          }
          if (type === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword(values);
            console.log('data from login()', data);
            if (error) console.log(error);
          }
        })}
      >
        <Stack>
          <Button
            type="button"
            radius="xl"
            onClick={async () => {
              const { data, error } = await supabase.auth.signInWithPassword({
                email: import.meta.env.VITE_DEMO_EMAIL,
                password: import.meta.env.VITE_DEMO_PASSWORD,
              });
              console.log('data from login()', data);
              if (error) console.log(error);
            }}
            className="w-full outline outline-1 outline-blue-700 hover:bg-blue-700"
          >
            Login with demo account
          </Button>
          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
