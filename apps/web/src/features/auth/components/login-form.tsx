import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

// import { useAuthStore } from "../../../store/store";
import { z } from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/store";
import { useCallback } from "react";

const formSchema = z.object({
  email: z.email({ message: "Email es obligatorio" }),
  password: z
    .string()
    .min(8, { message: "Contraseña es obligatoria de 8 caracteres" }),
});

type formType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login, loginWithGoogle } = useAuthStore();

  const handleGoogleLogin = useCallback(async () => {
    await loginWithGoogle();
  }, [loginWithGoogle]);

  const navigate = useNavigate();

  const form = useForm<formType>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: formType) => {
    const { email, password } = values;

    try {
      await login(email, password);

      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Error en las credenciales");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@email.com" {...field} />
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="*****" {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <div className="flex items-center">
              <Link
                to="/auth/forgot"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              o continua con
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              console.log("Google login clicked");
              // handleGoogleLogin
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          No tienes cuenta{" "}
          <a href="#" className="underline underline-offset-4">
            Registrate
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
