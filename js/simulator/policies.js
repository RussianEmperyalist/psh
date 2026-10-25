/**
 * Учебная политика ExecutionPolicy.
 * По умолчанию: RemoteSigned.
 */

export let executionPolicy = 'RemoteSigned';

export function getExecutionPolicy() {
  return executionPolicy;
}

export function setExecutionPolicy(value) {
  executionPolicy = value || executionPolicy;
}

export function resetExecutionPolicy() {
  executionPolicy = 'RemoteSigned';
}
