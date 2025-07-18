"use client";

import { Container, Box, Button } from "@mui/material";
import EditableField from "../EditableField/EditableField";
import { ChangeEvent, useEffect, useState } from "react";
import { Circuit } from "@/data/circuits/definitions";
import CountrySelect from "../CountrySelect/CountrySelect";

export default function CircuitDetailsPage({
  circuit,
  dict,
  modalBtns,
}: {
  circuit: Circuit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  modalBtns?:
    | {
        edit: () => void;
        cancel: () => void;
        save: () => void;
        isEditing: boolean;
      }
    | undefined;
}) {
  const [isEditing, setIsEditing] = useState(modalBtns?.isEditing || false);
  const [editableCircuit, setEditableCircuit] = useState(circuit);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setEditableCircuit((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    if (modalBtns) modalBtns.edit();
    setIsEditing(true);
  };

  const handleDiscardChanges = () => {
    if (modalBtns) modalBtns.cancel();
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    if (modalBtns) modalBtns.save();
    setIsEditing(false);
  };

  useEffect(() => {
    if (modalBtns) setIsEditing(modalBtns.isEditing);
  }, [modalBtns]);

  useEffect(() => {
    if (editableCircuit.circuitImage) {
      if (editableCircuit.circuitImage.trim().startsWith("<svg"))
        setImagePreview(editableCircuit.circuitImage);
      else setImagePreview(null);
    } else setImagePreview(null);
  }, [editableCircuit.circuitImage]);

  return (
    <Container maxWidth="xl">
      <Box className="w-full mt-8 p-0">
        <EditableField
          label={dict.Name}
          value={editableCircuit.name}
          onChange={handleInputChange}
          isEditing={isEditing}
          name="name"
          variant="h6"
          visible={isEditing}
        />
        <EditableField
          label={dict.Place}
          value={editableCircuit.place}
          onChange={handleInputChange}
          isEditing={isEditing}
          name="place"
        />
        <CountrySelect
          value={editableCircuit.state}
          editable={isEditing}
          key={`${editableCircuit.state}`}
          variant="h6"
          onChange={() => {}}
        />
        <EditableField
          label={dict.Image}
          name="circuitImage"
          value={editableCircuit.circuitImage || ""}
          onChange={handleInputChange}
          isEditing={isEditing}
          type="image"
        />
        {isEditing && (
          <div
            className={`transition-all duration-500 ease-in-out h-full ${
              imagePreview ? "max-h-[250px]" : "max-h-[0px]"
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
        )}
        <EditableField
          label={dict.Active}
          value={editableCircuit.active}
          onChange={handleInputChange}
          isEditing={isEditing}
          name="active"
          type="boolean"
        />

        {modalBtns === undefined && (
          <div className="w-full flex justify-end border-t mt-2 pt-4 ">
            {!isEditing && (
              <Button variant="contained" onClick={handleEdit}>
                {dict.Edit}
              </Button>
            )}

            {/* Pulsante per salvare le modifiche */}
            {isEditing && (
              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <Button onClick={handleDiscardChanges}>{dict.Cancel}</Button>
                <Button variant="contained" onClick={handleSaveChanges}>
                  {dict.Save}
                </Button>
              </Box>
            )}
          </div>
        )}
      </Box>
    </Container>
  );
}
