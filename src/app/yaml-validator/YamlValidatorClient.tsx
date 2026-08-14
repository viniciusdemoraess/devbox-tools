"use client";

import { useCallback } from "react";
import * as yaml from "js-yaml";
import FormatterTool from "@/components/FormatterTool";

const EXAMPLE = `name: my-app
version: "1.0.0"
description: A sample application

services:
  api:
    image: node:20
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://localhost/mydb
    volumes:
      - ./src:/app/src

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb`;

export default function YamlValidatorClient() {
  const format = useCallback((input: string) => {
    try {
      const parsed = yaml.load(input);
      return { output: yaml.dump(parsed, { indent: 2, lineWidth: -1 }) };
    } catch (e) {
      const yamlErr = e as yaml.YAMLException;
      const line = yamlErr.mark ? yamlErr.mark.line + 1 : undefined;
      const column = yamlErr.mark ? yamlErr.mark.column + 1 : undefined;
      const message = yamlErr.reason ?? String(e);
      return { output: "", error: message, errorLine: line, errorColumn: column };
    }
  }, []);

  return (
    <FormatterTool
      mode="yaml"
      format={format}
      example={EXAMPLE}
      placeholder={"name: devbox\nversion: 1.0.0\nservices:\n  - api\n  - web"}
    />
  );
}
