"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";

interface EditChatModalProps {
  open: boolean;
  onClose: () => void;
  chat: any;
  discordAccountId: string;
  onChatUpdated: () => void;
  user: any;
}

export default function EditChatModal({
  open,
  onClose,
  chat,
  discordAccountId,
  onChatUpdated,
  user,
}: EditChatModalProps) {
  const [name, setName] = useState(chat.name || "");
  const [discordChatId, setDiscordChatId] = useState(chat.discordChatId || "");
  const [minInterval, setMinInterval] = useState(
    chat.min_interval ? String(chat.min_interval) : ""
  );
  const [maxInterval, setMaxInterval] = useState(
    chat.max_interval ? String(chat.max_interval) : ""
  );
  const [promptSystem, setPromptSystem] = useState(chat.prompt_system || "");
  const [promptUser, setPromptUser] = useState(chat.prompt_user || "");
  const [maxTokens, setMaxTokens] = useState(
    chat.max_tokens ? String(chat.max_tokens) : ""
  );
  const [temperature, setTemperature] = useState(chat.temperature || 0.7);
  const [gptModel, setGptModel] = useState(chat.gpt_model || "");
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { openai_api_key: apiKey } = user;

  useEffect(() => {
    const fetchModels = async () => {
      if (!apiKey) {
        toast.error("OpenAI API Key відсутній!");
        return;
      }
      try {
        const response = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Помилка отримання моделей");
        }

        const data = await response.json();
        const modelList = data.data.map((model: any) => model.id);

        setModels(modelList);
        if (!modelList.includes(gptModel)) {
          setGptModel(modelList[0]);
        }
      } catch {
        toast.error("Не вдалося отримати моделі OpenAI");
      }
    };

    fetchModels();
  }, [apiKey]);

  useEffect(() => {
    if (chat) {
      setName(chat.name || "");
      setDiscordChatId(chat.discordChatId || "");
      setMinInterval(chat.min_interval ? String(chat.min_interval) : "");
      setMaxInterval(chat.max_interval ? String(chat.max_interval) : "");
      setPromptSystem(chat.prompt_system || "");
      setPromptUser(chat.prompt_user || "");
      setMaxTokens(chat.max_tokens ? String(chat.max_tokens) : "");
      setTemperature(chat.temperature || 0.7);
      setGptModel(chat.gpt_model || "");
    }
  }, [chat]);

  const isFormValid = () => {
    return (
      name.trim() &&
      discordChatId.trim() &&
      Number(minInterval) >= 1 &&
      Number(maxInterval) >= 1 &&
      Number(minInterval) <= Number(maxInterval) &&
      promptSystem.trim() &&
      promptUser.trim() &&
      Number(maxTokens) >= 1 &&
      temperature >= 0 &&
      temperature <= 1 &&
      gptModel.trim()
    );
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      toast.error("Заповніть всі обов’язкові поля правильно!");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.patch(
        `/discord-accounts/${discordAccountId}/chats/${chat.id}`,
        {
          name,
          discordChatId,
          min_interval: minInterval ? Number(minInterval) : null,
          max_interval: maxInterval ? Number(maxInterval) : null,
          prompt_system: promptSystem,
          prompt_user: promptUser,
          max_tokens: maxTokens ? Number(maxTokens) : null,
          temperature,
          gpt_model: gptModel,
        }
      );
      toast.success("Чат оновлено!");
      onChatUpdated();
      onClose();
    } catch {
      toast.error("Помилка оновлення чату");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          background: "#121212",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: 600,
          textAlign: "center",
          pb: 0,
        }}
      >
        EDIT CHAT
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Chat name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            fullWidth
          />
          <TextField
            label="Discord Chat ID"
            value={discordChatId}
            onChange={(e) => setDiscordChatId(e.target.value)}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            fullWidth
          />
          <TextField
            label="Minimum interval (sec)"
            value={minInterval}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            onChange={(e) =>
              setMinInterval(e.target.value.replace(/\D/g, "") || "")
            }
            fullWidth
          />
          <TextField
            label="Maximum interval (sec)"
            value={maxInterval}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            onChange={(e) =>
              setMaxInterval(e.target.value.replace(/\D/g, "") || "")
            }
            fullWidth
          />
          <TextField
            label="System prompt"
            value={promptSystem}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            multiline
            rows={4}
            onChange={(e) => setPromptSystem(e.target.value)}
            fullWidth
          />
          <TextField
            label="User prompt"
            value={promptUser}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            multiline
            rows={4}
            onChange={(e) => setPromptUser(e.target.value)}
            fullWidth
          />
          <TextField
            label="Maximum tokens"
            value={maxTokens}
            InputLabelProps={{ style: { color: "#bbb" } }}
            InputProps={{
              autoComplete: "new-password",
              style: {
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              },
            }}
            onChange={(e) =>
              setMaxTokens(e.target.value.replace(/\D/g, "") || "")
            }
            fullWidth
          />
          <Box>
            <Typography id="temperature-slider" gutterBottom>
              Temperature
            </Typography>
            <Slider
              value={temperature}
              onChange={(e, newValue) => setTemperature(newValue as number)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>
          <FormControl
            fullWidth
            sx={{
              backgroundColor: "#1f1f1f",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#777",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
            }}
          >
            <InputLabel sx={{ color: "#bbb" }}>GPT Model</InputLabel>
            <Select
              value={gptModel}
              onChange={(e) => setGptModel(e.target.value)}
              sx={{
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1f1f1f", // Темний фон списку
                    color: "#fff", // Білий текст
                    "& .MuiMenuItem-root": {
                      color: "#fff", // Колір тексту
                      "&:hover": { backgroundColor: "#333" }, // При наведенні
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#4caf50 !important", // Зелений фон вибраного
                      color: "#fff", // Білий текст вибраного елемента
                      "&:hover": { backgroundColor: "#388e3c !important" }, // Темніший зелений при наведенні
                    },
                  },
                },
              }}
            >
              {models.length > 0 ? (
                models.map((model) => (
                  <MenuItem
                    key={model}
                    value={model}
                    sx={{
                      color: "#fff",
                      backgroundColor: "#1f1f1f",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    {model}
                  </MenuItem>
                ))
              ) : (
                <MenuItem sx={{ color: "red" }} disabled>
                  Завантаження...
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#ff4d4d",
            backgroundColor: "transparent",
            border: "1px solid transparent",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              color: "#ff4d4d", // Red text on hover
              backgroundColor: "#ff4d4d19", // Light red background
              borderColor: "#ff4d4d", // Red border on hover
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleUpdate}
          disabled={loading || !isFormValid()}
          sx={{
            color: "#a3d9a5", // Light green text
            backgroundColor: "transparent",
            border: "1px solid transparent",

            transition: "all 0.3s ease-in-out",
            "&:hover": {
              color: "#4caf50", // Darker green text on hover
              backgroundColor: "rgba(76, 175, 80, 0.1)", // Light green background
              borderColor: "#4caf50", // Green border on hover
            },
            "&:disabled": {
              color: "#777", // Gray text
              borderColor: "#555", // Dark gray border
              backgroundColor: "transparent",
              cursor: "not-allowed",
              "&:hover": {
                color: "#777",
                backgroundColor: "transparent",
                borderColor: "#4caf50",
              },
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
