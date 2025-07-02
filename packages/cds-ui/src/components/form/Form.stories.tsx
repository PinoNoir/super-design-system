import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Form from './Form';
import { Button } from '../button';
import { FormBlock } from '../form-block';
import FormFooter from './FormFooter';
import { Box } from '../box';
import EmailInput from '../input-fields/components/EmailInput';
import SSNInput from '../input-fields/components/SSNInput';
import TextInput from '../text-input/TextInput';
import PhoneInput from '../input-fields/components/PhoneInput';
import { Toast, ToastProvider } from '../toast';
import FormWrapper from '../form-block/FormWrapper';
import FormSelect from './FormSelect';

const meta: Meta = {
  title: 'Components/Forms/Form',
  component: Form,
  subcomponents: { FormBlock, FormFooter, FormWrapper },
  tags: ['!autodocs'],
  decorators: [
    (Story) => (
      <div style={{ margin: 'auto' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    id: {
      control: {
        type: 'text',
      },
    },
    header: {
      control: 'text',
    },
    footer: {
      control: 'object',
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    onSubmit: {
      control: {
        type: null,
      },
    },
    onReset: {
      control: {
        type: null,
      },
    },
    className: {
      control: {
        type: 'text',
      },
    },
    isLoading: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Form>;

// Schema with custom validation
const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  suffix: z.string().min(1, 'Suffix is required'),
  indexedAs: z.string().min(1, 'Indexed As is required'),
  SSN: z
    .string()
    .min(1, 'SSN is required')
    .regex(/^(?!000|666|9)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/, 'Invalid SSN format - must be xxx-xx-xxxx'),
  Phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format - must be (xxx) xxx-xxxx'),
  Email: z.string().min(1, 'Email is required.').email('Invalid email format'),
});

type FormData = z.infer<typeof formSchema>;

export const WithZodValidation: Story = {
  render: function Default() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{
      open: boolean;
      variant: 'success' | 'error';
      message: string;
      header: string;
    }>({
      open: false,
      variant: 'success',
      message: '',
      header: '',
    });

    // Set up form methods with react-hook-form
    const formMethods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        indexedAs: '',
        SSN: '',
        Phone: '',
        Email: '',
      },
      mode: 'onTouched',
      reValidateMode: 'onChange',
      shouldFocusError: true,
    });

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = formMethods;

    const closeToast = () => {
      setToast((prev) => ({ ...prev, open: false }));
    };

    const showToast = (variant: 'success' | 'error', message: string, header: string) => {
      setToast({
        open: true,
        variant,
        message,
        header,
      });
    };

    const saveData = async (data: FormData) => {
      try {
        setIsLoading(true);

        // Simulate API call with 95% success rate (5% chance of failure for demo purposes)
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            const shouldSucceed = Math.random() > 0.05;
            if (shouldSucceed) {
              resolve('Success');
            } else {
              reject(new Error('Network error'));
            }
          }, 2000);
        });

        // If successful
        console.log('Form submitted:', data);
        showToast('success', 'Client information has been saved successfully.', 'Success');

        // Optional: Reset form or redirect here
        reset();
      } catch (error) {
        console.error('Error submitting form:', error);
        showToast('error', 'Unable to save client information. Please try again.', 'Error');
      } finally {
        setIsLoading(false);
      }
    };

    const handleReset = () => {
      reset();
    };

    return (
      <>
        <ToastProvider swipeDirection="right">
          <Toast
            variant={toast.variant}
            header={toast.header}
            onClose={closeToast}
            open={toast.open}
            message={toast.message}
            duration={5000}
          />
        </ToastProvider>

        <FormWrapper variant="panel">
          <FormProvider {...formMethods}>
            <Form
              id="add-client-form"
              header="Add New Client"
              helperText="Fields marked with a red asterisk are required."
              onSubmit={handleSubmit(saveData)}
              onReset={handleReset}
              isLoading={isLoading}
              footer={
                <FormFooter>
                  <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap="16">
                    <Button variant="primary" type="submit" isLoading={isLoading} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="secondary" type="reset" disabled={isLoading}>
                      Reset
                    </Button>
                    <Button variant="secondary" type="button" disabled={isLoading}>
                      Cancel
                    </Button>
                  </Box>
                </FormFooter>
              }
            >
              <FormBlock layoutVariant="1-column">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="first-name"
                      label="First Name"
                      required
                      invalid={!!errors.firstName}
                      invalidText={errors.firstName?.message}
                    />
                  )}
                />
              </FormBlock>

              <FormBlock layoutVariant="2-column">
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => <TextInput {...field} id="middle-name" label="Middle Name" />}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="last-name"
                      label="Last Name"
                      required
                      invalid={!!errors.lastName}
                      invalidText={errors.lastName?.message}
                    />
                  )}
                />
              </FormBlock>

              <FormBlock layoutVariant="2-column">
                <Controller
                  name="suffix"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormSelect {...field} id="suffix" label="Suffix" required error={fieldState.error?.message}>
                      <option value="">Select a suffix</option>
                      <option value="N/A">N/A</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                      <option value="SR">SR.</option>
                      <option value="JR">JR.</option>
                      <option value="JD">J.D.</option>
                      <option value="MD">M.D.</option>
                    </FormSelect>
                  )}
                />

                <Controller
                  name="indexedAs"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="Indexed As"
                      id="indexed-as"
                      required
                      invalid={!!errors.indexedAs}
                      invalidText={errors.indexedAs?.message}
                    />
                  )}
                />
              </FormBlock>

              <FormBlock layoutVariant="3-column" marginBlockEnd="24px">
                <Controller
                  control={control}
                  name="Phone"
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      id="phone"
                      label="Phone"
                      required
                      invalid={!!errors.Phone}
                      invalidText={errors.Phone?.message}
                    />
                  )}
                />
                <Controller
                  name="SSN"
                  control={control}
                  render={({ field }) => (
                    <SSNInput
                      {...field}
                      id="ssn"
                      label="SSN"
                      required
                      invalid={!!errors.SSN}
                      invalidText={errors.SSN?.message}
                    />
                  )}
                />
                <Controller
                  name="Email"
                  control={control}
                  render={({ field }) => (
                    <EmailInput
                      {...field}
                      id="email"
                      label="Email"
                      required
                      invalid={!!errors.Email}
                      invalidText={errors.Email?.message}
                    />
                  )}
                />
              </FormBlock>
            </Form>
          </FormProvider>
        </FormWrapper>
      </>
    );
  },
};
