const CONNECTOR_KEYS_STORAGE_KEY = "sales-command-center.connector-keys.v1";

export interface ConnectorKeyRecord {
  connector: string;
  key: string;
  updatedAt: string;
}

export type ConnectorKeyMap = Record<string, ConnectorKeyRecord>;

export function loadConnectorKeys(): ConnectorKeyMap {
  if (!isBrowserStorageAvailable()) {
    return {};
  }

  const rawKeys = window.localStorage.getItem(CONNECTOR_KEYS_STORAGE_KEY);

  if (!rawKeys) {
    return {};
  }

  try {
    const parsedKeys: unknown = JSON.parse(rawKeys);
    if (!parsedKeys || typeof parsedKeys !== "object" || Array.isArray(parsedKeys)) {
      return {};
    }

    const records: ConnectorKeyMap = {};

    for (const [connector, value] of Object.entries(parsedKeys as Record<string, unknown>)) {
      if (isConnectorKeyRecord(value)) {
        records[connector] = value;
      }
    }

    return records;
  } catch {
    return {};
  }
}

export function saveConnectorKey(connector: string, key: string): ConnectorKeyMap {
  const nextKeys = {
    ...loadConnectorKeys(),
    [connector]: {
      connector,
      key,
      updatedAt: new Date().toISOString(),
    },
  };

  writeConnectorKeys(nextKeys);
  return nextKeys;
}

export function deleteConnectorKey(connector: string): ConnectorKeyMap {
  const nextKeys = { ...loadConnectorKeys() };
  delete nextKeys[connector];
  writeConnectorKeys(nextKeys);
  return nextKeys;
}

export function maskConnectorKey(key: string) {
  if (key.length <= 8) {
    return "saved key";
  }

  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function writeConnectorKeys(keys: ConnectorKeyMap) {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  window.localStorage.setItem(CONNECTOR_KEYS_STORAGE_KEY, JSON.stringify(keys));
}

function isBrowserStorageAvailable() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function isConnectorKeyRecord(value: unknown): value is ConnectorKeyRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.connector === "string" &&
    typeof record.key === "string" &&
    typeof record.updatedAt === "string"
  );
}
