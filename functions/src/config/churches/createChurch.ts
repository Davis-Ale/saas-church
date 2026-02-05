import * as functions from "firebase-functions";
import { prisma } from "../../db/prisma";
import slugify from "slugify";
import { countryProfiles } from "../countryProfiles";

/**
 * Resolve country profile de forma segura (TS-friendly)
 */
function resolveCountryProfile(country: string) {
  const key = country.toUpperCase();

  switch (key) {
    case "BR":
    case "CA":
    case "US":
    case "PT":
      return { key, profile: countryProfiles[key] };
    default:
      return null;
  }
}

/**
 * ⚠️ FUNÇÃO TEMPORÁRIA — APENAS PARA TESTE LOCAL
 * NÃO USAR EM PRODUÇÃO
 */
export const createChurchHttp = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      const { name, country } = req.body ?? {};

      if (!name || !country) {
        res.status(400).json({
          error: "
