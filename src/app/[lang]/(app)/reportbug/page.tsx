"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Paper,
    InputAdornment,
    Snackbar,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import PageHeader from "@/components/PageHeader/PageHeader";
import { PACKAGE_VERSION } from "@/configs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Priority = "low" | "medium" | "high" | "critical";
type Environment = "production" | "staging" | "development";
type Status = "idle" | "loading" | "success" | "error";

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "#4caf50" },
    { value: "medium", label: "Medium", color: "#ff9800" },
    { value: "high", label: "High", color: "#f44336" },
    { value: "critical", label: "Critical", color: "#9c27b0" },
];

const ENVIRONMENTS: { value: Environment; label: string }[] = [
    { value: "production", label: "Production" },
    { value: "staging", label: "Staging" },
    { value: "development", label: "Development" },
];

const MAX_FILE_SIZE_MB = 10;
const REDIRECT_DELAY_MS = 2500;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportBugPage() {
    const router = useRouter();

    // ⚠️  Replace this with your actual auth hook / session
    // const { user } = useSession();
    const user = {
        id: undefined as string | undefined,
        email: undefined as string | undefined,
        username: undefined as string | undefined,
    };

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stepsToReproduce, setStepsToReproduce] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [environment, setEnvironment] = useState<Environment>("production");
    const [referenceEmail, setReferenceEmail] = useState(user?.email ?? "");
    const [pageUrl, setPageUrl] = useState(
        typeof window !== "undefined" ? window.location.href : ""
    );
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const appVersion = PACKAGE_VERSION;

    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-redirect after success
    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => router.back(), REDIRECT_DELAY_MS);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    const showToast = (message: string, severity: "success" | "error") => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            showToast(`File must be smaller than ${MAX_FILE_SIZE_MB}MB`, "error");
            return;
        }
        setScreenshot(file);
    };

    const handleRemoveFile = () => {
        setScreenshot(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            showToast("Title and description are required.", "error");
            return;
        }

        if (referenceEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referenceEmail)) {
            showToast("Please enter a valid reference email.", "error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("stepsToReproduce", stepsToReproduce.trim());
        formData.append("priority", priority);
        formData.append("environment", environment);
        formData.append("appVersion", PACKAGE_VERSION);
        formData.append("referenceEmail", referenceEmail.trim());
        formData.append("pageUrl", pageUrl.trim());
        formData.append("userAgent", navigator.userAgent);
        if (user?.id) formData.append("userId", user.id);
        if (user?.email) formData.append("userEmail", user.email);
        if (user?.username) formData.append("username", user.username);
        if (screenshot) formData.append("screenshot", screenshot);

        try {
            const res = await fetch("/api/jira/create-issue", {
                method: "POST",
                body: formData,
            });

            // Guard: se la response non è JSON (es. 404 in HTML) lancia subito
            const contentType = res.headers.get("content-type") ?? "";
            if (!contentType.includes("application/json")) {
                throw new Error(`Unexpected response (${res.status}) — check that the API route exists.`);
            }

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error ?? "Unknown error");
            }

            setStatus("success");
            showToast(
                `Bug reported! Ticket: ${data.issueKey} — redirecting in a moment...`,
                "success"
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setErrorMessage(message);
            setStatus("error");
            showToast(message, "error");
        }
    };

    const isSubmitting = status === "loading";

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <>
            <PageHeader title="Reporting" />

            <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>

                    {/* Card Header */}
                    <Box
                        sx={{
                            px: { xs: 2, sm: 4 },
                            py: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <BugReportIcon color="error" sx={{ fontSize: 28 }} />
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    Report a Bug
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Describe the issue and we'll look into it as soon as possible.
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.back()}
                            variant="outlined"
                            size="small"
                            disabled={isSubmitting}
                        >
                            Back
                        </Button>
                    </Box>

                    {/* Card Content */}
                    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

                            {/* Inline error alert */}
                            {status === "error" && (
                                <Alert severity="error" onClose={() => setStatus("idle")}>
                                    {errorMessage}
                                </Alert>
                            )}

                            {/* ── Section: Bug details ── */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Bug details
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <TextField
                                        label="Title *"
                                        placeholder="Short, descriptive summary of the bug"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        fullWidth
                                        disabled={isSubmitting}
                                        inputProps={{ maxLength: 200 }}
                                        error={!title.trim() && !!errorMessage}
                                        helperText={`${title.length}/200`}
                                    />
                                    <TextField
                                        label="Description *"
                                        placeholder="What happened? What did you expect to happen?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        disabled={isSubmitting}
                                        error={!description.trim() && !!errorMessage}
                                    />
                                    <TextField
                                        label="Steps to reproduce"
                                        placeholder={"1. Go to...\n2. Click on...\n3. Observe that..."}
                                        value={stepsToReproduce}
                                        onChange={(e) => setStepsToReproduce(e.target.value)}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        disabled={isSubmitting}
                                        helperText="Optional but very helpful"
                                    />
                                </Box>
                            </Box>

                            <Divider />

                            {/* ── Section: Classification ── */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Classification
                                </Typography>
                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                                    <Box>
                                        <TextField
                                            label="Priority"
                                            select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as Priority)}
                                            fullWidth
                                            disabled={isSubmitting}
                                        >
                                            {PRIORITIES.map((p) => (
                                                <MenuItem key={p.value} value={p.value}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Box
                                                            sx={{
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: "50%",
                                                                backgroundColor: p.color,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        {p.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="Environment"
                                            select
                                            value={environment}
                                            onChange={(e) => setEnvironment(e.target.value as Environment)}
                                            fullWidth
                                            disabled={isSubmitting}
                                        >
                                            {ENVIRONMENTS.map((env) => (
                                                <MenuItem key={env.value} value={env.value}>
                                                    {env.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="App version"
                                            value={appVersion}
                                            fullWidth
                                            disabled
                                            helperText="Auto-detected from package.json"
                                        />
                                    </Box>
                                    <Box>
                                        <TextField
                                            label="Reference email"
                                            placeholder="email@example.com"
                                            value={referenceEmail}
                                            onChange={(e) => setReferenceEmail(e.target.value)}
                                            fullWidth
                                            disabled={isSubmitting}
                                            helperText="Who should receive updates on this bug"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ gridColumn: "1 / -1" }}>
                                        <TextField
                                            label="Page URL"
                                            value={pageUrl}
                                            onChange={(e) => setPageUrl(e.target.value)}
                                            fullWidth
                                            disabled={isSubmitting}
                                            helperText="Pre-filled with the current page — edit if the bug occurred elsewhere"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />

                            {/* ── Section: Attachments ── */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Attachments
                                </Typography>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                    id="bug-screenshot-input"
                                />
                                {screenshot ? (
                                    <Chip
                                        label={screenshot.name}
                                        onDelete={handleRemoveFile}
                                        icon={<AttachFileIcon />}
                                        variant="outlined"
                                        sx={{
                                            maxWidth: "100%",
                                            "& .MuiChip-label": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            },
                                        }}
                                    />
                                ) : (
                                    <Button
                                        component="label"
                                        htmlFor="bug-screenshot-input"
                                        variant="outlined"
                                        startIcon={<AttachFileIcon />}
                                        disabled={isSubmitting}
                                    >
                                        Attach screenshot (optional)
                                    </Button>
                                )}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mt: 0.5 }}
                                >
                                    Max {MAX_FILE_SIZE_MB}MB — PNG, JPG, WEBP
                                </Typography>
                            </Box>

                            <Divider />

                            {/* ── Auto-collected info notice ── */}
                            <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    The following info will be automatically attached to help debug: browser info
                                    {user?.email ? " and your account email" : ""}.
                                </Typography>
                            </Alert>

                            {/* ── Actions ── */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="error"
                                    disabled={isSubmitting || !title.trim() || !description.trim()}
                                    startIcon={
                                        isSubmitting ? (
                                            <CircularProgress size={16} color="inherit" />
                                        ) : (
                                            <BugReportIcon />
                                        )
                                    }
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Bug"}
                                </Button>
                            </Box>

                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* ── Toast ── */}
            <Snackbar
                open={toastOpen}
                autoHideDuration={toastSeverity === "success" ? REDIRECT_DELAY_MS : 4000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toastSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
