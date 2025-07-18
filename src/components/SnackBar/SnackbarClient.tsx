"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface State extends SnackbarOrigin {
    open: boolean;
}

export default function SnackbarClient() {
    const [state, setState] = useState<State>({
        open: true,
        vertical: "top",
        horizontal: "center",
    });

    const { vertical, horizontal, open } = state;

    const handleClick = (newState: SnackbarOrigin) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState(prev => ({ ...prev, open: false }));
    };

    const buttons = (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        color="secondary"
                        sx={{ fontSize: "1.2rem" }}
                        onClick={handleClick({ vertical: "top", horizontal: "center" })}
                    >
                        Top-Center
                    </Button>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", maxWidth: 600 }}>
                    <Button
                        color="secondary"
                        sx={{ fontSize: "1.2rem" }}
                        onClick={handleClick({ vertical: "top", horizontal: "left" })}
                    >
                        Top-Left
                    </Button>
                    <Button
                        color="secondary"
                        sx={{ fontSize: "1.2rem" }}
                        onClick={handleClick({ vertical: "top", horizontal: "right" })}
                    >
                        Top-Right
                    </Button>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", maxWidth: 600 }}>
                    <Button
                        color="secondary"
                        sx={{ fontSize: "1.2rem" }}
                        onClick={handleClick({ vertical: "bottom", horizontal: "left" })}
                    >
                        Bottom-Left
                    </Button>
                    <Button
                        color="secondary"
                        sx={{ fontSize: "1.2rem" }}
                        onClick={handleClick({ vertical: "bottom", horizontal: "right" })}
                    >
                        Bottom-Right
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                    color="secondary"
                    sx={{ fontSize: "1.2rem" }}
                    onClick={handleClick({ vertical: "bottom", horizontal: "center" })}
                >
                    Bottom-Center
                </Button>
            </Box>
        </>
    );

    return (
        <Box sx={{ width: 500, fontSize: "1.2rem" }}>
            {buttons}
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message={<span style={{ fontSize: "1.2rem" }}>I love snacks</span>}
                key={vertical + horizontal}
            />
        </Box>
    );
}
