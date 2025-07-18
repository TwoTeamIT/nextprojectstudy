"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import { Circuit } from "@/data/circuits/definitions";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
//import { saveOrUpdateCircuit } from "@/data/circuits/circuits";
import CountrySelect, { CountryType } from "../CountrySelect/CountrySelect";

interface CircuitModalProps {
  circuit: Circuit;
  //onSave: (updatedCircuit: Circuit) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function CircuitModal({
  circuit,
  //onSave,
  dict,
}: CircuitModalProps) {
  const router = useRouter();

  const [updatedCircuit, setUpdatedCircuit] = useState<Circuit>({ ...circuit });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    if (isEditing) setIsEditing(false);
    router.back();
  };

  useEffect(() => {
    if (updatedCircuit.circuitImage) {
      if (updatedCircuit.circuitImage.trim().startsWith("<svg"))
        setImagePreview(updatedCircuit.circuitImage);
      else setImagePreview(null);
    } else setImagePreview(null);
  }, [updatedCircuit.circuitImage]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setUpdatedCircuit((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    //await saveOrUpdateCircuit(updatedCircuit).then(() => {
    //  handleClose();
    //});
  };

  return (
    <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        typography="h5"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginInline: 1.5,
        }}
        className="border-b"
      >
        {circuit ? dict.DialogEdit : dict.DialogCreate}
        <IconButton key={"close-modal"} onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label={dict.Name}
          name="name"
          value={updatedCircuit.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={dict.Place}
          name="place"
          value={updatedCircuit.place}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <CountrySelect
          label={dict.State}
          value={updatedCircuit.state}
          editable
          key={`${updatedCircuit.state}`}
          variant="h6"
          onChange={(country: CountryType) => {
            setUpdatedCircuit((prevState) => ({
              ...prevState,
              state: country.label,
            }));
          }}
        />
        <TextField
          label={dict.Image}
          name="circuitImage"
          value={updatedCircuit.circuitImage || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          maxRows={2}
        />
        <div
          className={`transition-all duration-500 ease-in-out h-full ${imagePreview ? "max-h-[250px]" : "max-h-[0px]"
            }`}
          style={{ marginTop: -10 }}
        >
          {imagePreview?.startsWith("<svg") && (
            <div
              className="w-full h-full border-b border-l border-r"
              style={{
                borderColor: "#ccc",
                borderRadius: 3,
                padding: "10px",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{
                __html: `<svg style="width: 100%; height: auto; max-height: 230px;" ${imagePreview.slice(
                  4
                )}`,
              }}
            />
          )}
        </div>
        <FormControlLabel
          className="mt-3"
          control={
            <Checkbox
              checked={updatedCircuit.active}
              onChange={handleInputChange}
              name="active"
            />
          }
          label={dict.Active + ":"}
          labelPlacement="start"
        />
      </DialogContent>
      <DialogActions className="border-t mx-3 mb-2">
        <Button onClick={handleClose}>{dict.Cancel}</Button>
        <Button variant="contained" onClick={handleSave}>
          {dict.Save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
