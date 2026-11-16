import axios from "axios";

import { WHATSAPP } from "@/constants/env";

const whatsapp = axios.create({
  baseURL: WHATSAPP.WHATSAPP_BASE_URL,
  headers: {
    Authorization: `Bearer ${WHATSAPP.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export { whatsapp };
