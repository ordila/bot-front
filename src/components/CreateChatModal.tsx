// components/CreateChatModal.tsx
"use client";
import React, { useEffect, useState } from "react";
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

interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
  discordAccountId: string;
  onChatCreated: () => void;
  user: any;
}

export default function CreateChatModal({
  open,
  onClose,
  discordAccountId,
  onChatCreated,
  user,
}: CreateChatModalProps) {
  const [discordChatId, setDiscordChatId] = useState("");
  const [minInterval, setMinInterval] = useState<number>();
  const [maxInterval, setMaxInterval] = useState<number>();
  const [promptSystem, setPromptSystem] = useState("");
  const [promptUser, setPromptUser] = useState("");
  const [maxTokens, setMaxTokens] = useState<number>();
  const [temperature, setTemperature] = useState<number>(0.7);
  const [models, setModels] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [gptModel, setGptModel] = useState("");

  // Статус за замовчуванням "paused" (не відображається у формі)
  const [status] = useState("stopped");

  const { openai_api_key: apiKey } = user;

  // Завантаження списку моделей з OpenAI API
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
        setGptModel(modelList[0]); // Встановлюємо першу модель за замовчуванням
      } catch {
        toast.error("Не вдалося отримати моделі OpenAI");
      }
    };

    fetchModels();
  }, [apiKey]);

  const handleCreate = async () => {
    if (!discordChatId.trim() || !minInterval || !maxInterval) {
      toast.error("Заповніть обов'язкові поля!");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(`/discord-accounts/${discordAccountId}/chats`, {
        name,
        discordChatId,
        min_interval: minInterval,
        max_interval: maxInterval,
        prompt_system: promptSystem,
        prompt_user: promptUser,
        max_tokens: maxTokens,
        temperature,
        gpt_model: gptModel,
        status,
      });
      toast.success("Чат створено!");
      onChatCreated();
      onClose();

      setName("");
      setDiscordChatId("");
      setMinInterval(0);
      setMaxInterval(0);
      setPromptSystem("");
      setPromptUser("");
      setMaxTokens(0);
      setTemperature(0.7);
    } catch {
      toast.error("Помилка створення чату");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      name.trim() &&
      discordChatId.trim() &&
      minInterval >= 1 &&
      maxInterval >= 1 &&
      minInterval <= maxInterval &&
      promptSystem.trim() &&
      promptUser.trim() &&
      maxTokens >= 1 &&
      temperature >= 0 &&
      temperature <= 1 &&
      gptModel.trim()
    );
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
        ADD ACCOUNT
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Chat Name"
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
            label="Minimum Interval (sec)"
            type="number"
            value={minInterval || ""}
            onChange={(e) => setMinInterval(Number(e.target.value))}
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
            label="Maximum Interval (sec)"
            type="number"
            value={maxInterval || ""}
            onChange={(e) => setMaxInterval(Number(e.target.value))}
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
            label="System Prompt"
            value={promptSystem}
            multiline
            rows={4}
            onChange={(e) => setPromptSystem(e.target.value)}
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
            label="User Prompt"
            value={promptUser}
            multiline
            rows={4}
            onChange={(e) => setPromptUser(e.target.value)}
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
            label="Maximum Tokens"
            type="number"
            value={maxTokens || ""}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
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
            sx={{ backgroundColor: "#1f1f1f", borderRadius: "8px" }}
          >
            <InputLabel sx={{ color: "#bbb" }}>GPT Model</InputLabel>
            <Select
              value={gptModel}
              onChange={(e) => setGptModel(e.target.value)}
              sx={{
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#777",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1f1f1f", // Темний фон для списку
                    color: "#fff", // Білий текст
                    "& .MuiMenuItem-root": {
                      color: "#fff", // Колір тексту для елементів
                      "&:hover": { backgroundColor: "#333" }, // При наведенні
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#4caf50 !important", // Зелений фон для вибраного
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
          onClick={handleCreate}
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
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
