import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    Container,
    Notification,
    Space,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
    getAuthError,
    getAuthStatus,
    loginUser,
    registerUser,
    selectAllAuth,
} from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";

export default function AuthenticationForm() {
    const [type, toggle] = useToggle(["login", "register"]);
    const form = useForm({
        initialValues: {
            email: "",
            name: "",
            password: "",
            terms: true,
        },

        validate: {
            name: (val) => {
                if (type === "register" && val.length < 2) {
                    return "Name must have at least 2 characters";
                } else {
                    return null;
                }
            },
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: (val) =>
                val.length < 6
                    ? "Password should include at least 6 characters"
                    : null,
        },
    });
    const dispatch = useDispatch();
    const onFormSubmit = (user) => {
        if (type === "register") {
            dispatch(registerUser(user));
        } else {
            dispatch(loginUser(user));
        }
    };
    const user = useSelector(selectAllAuth);
    const status = useSelector(getAuthStatus);
    const error = useSelector(getAuthError);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.name) {
            navigate("/list");
        }
    }, [user, navigate]);

    return (
        <Container size={"xs"}>
            <Paper radius="sm" p="xl" withBorder>
                <Text size="lg" weight={500}>
                    Welcome to Taskit, {type} with
                </Text>
                <Divider mb={20} mt={20}></Divider>
                <form onSubmit={form.onSubmit(onFormSubmit)}>
                    <Stack>
                        {type === "register" && (
                            <TextInput
                                required
                                label="Name"
                                placeholder="Your name"
                                value={form.values.name}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        "name",
                                        event.currentTarget.value
                                    )
                                }
                                error={form.errors.name && "Invalid name"}
                                radius="sm"
                            />
                        )}

                        <TextInput
                            required
                            label="Email"
                            placeholder="hello@mantine.dev"
                            value={form.values.email}
                            onChange={(event) =>
                                form.setFieldValue(
                                    "email",
                                    event.currentTarget.value
                                )
                            }
                            error={form.errors.email && "Invalid email"}
                            radius="sm"
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            value={form.values.password}
                            onChange={(event) =>
                                form.setFieldValue(
                                    "password",
                                    event.currentTarget.value
                                )
                            }
                            error={
                                form.errors.password &&
                                "Password should include at least 6 characters"
                            }
                            radius="sm"
                        />

                        {type === "register" && (
                            <Checkbox
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        "terms",
                                        event.currentTarget.checked
                                    )
                                }
                            />
                        )}
                    </Stack>

                    <Group position="apart" mt="xl">
                        <Anchor
                            component="button"
                            type="button"
                            color="dimmed"
                            onClick={() => toggle()}
                            size="xs"
                        >
                            {type === "register"
                                ? "Already have an account? Login"
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button type="submit" radius="sm">
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </form>
                <Space h="md"></Space>
                {status === "pending" ? (
                    <Notification
                        loading
                        title="Authentication in progress"
                        withCloseButton={false}
                    >
                        Please wait until while you are being authenticated.
                    </Notification>
                ) : (
                    <></>
                )}
                {error === "Request failed with status code 401" ? (
                    <Notification
                        icon={<IconX size="1.1rem" />}
                        title="Authentication failed"
                        withCloseButton={false}
                        color="red"
                    >
                        Please check your email or password.
                    </Notification>
                ) : (
                    <></>
                )}
                {error === "Request failed with status code 500" ? (
                    <Notification
                        icon={<IconX size="1.1rem" />}
                        title="Registration failed"
                        withCloseButton={false}
                        color="red"
                    >
                        Email address is already registered.
                    </Notification>
                ) : (
                    <></>
                )}
            </Paper>
        </Container>
    );
}
