import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import FormIcon from './form-icon';
import { Button, FormBlock, FormWrapper, TextInput } from 'sds-ui';
import styles from './styles/login-form.module.css';

export default function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  // Debug output
  console.log('Current form state:', state);

  return (
    <div className={styles.wrapper}>
      <FormWrapper variant="panel" className={styles.formContainer}>
        <form action={loginAction} className={styles.form}>
          <div className={styles.iconWrapper}>
            <FormIcon />
          </div>
          <h2>Welcome Back</h2>
          <FormBlock layoutVariant="1-column" marginBlockEnd="8px">
            <TextInput
              id="1"
              label="Email"
              hideLabel
              type="email"
              name="email"
              placeholder="Email"
              defaultValue=""
              required
              invalid={!!(state?.errors?.email && state.errors.email.length > 0)}
              invalidText={state?.errors?.email?.[0] ?? ''}
            />
          </FormBlock>

          <FormBlock layoutVariant="1-column" marginBlockEnd="8px">
            <TextInput
              id="2"
              label="Password"
              hideLabel
              type="password"
              name="password"
              placeholder="Password"
              defaultValue=""
              required
              invalid={!!(state?.errors?.password && state.errors.password.length > 0)}
              invalidText={state?.errors?.password?.[0] ?? ''}
            />
          </FormBlock>
          <SubmitButton />
        </form>
      </FormWrapper>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="base" disabled={pending} type="submit">
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}
