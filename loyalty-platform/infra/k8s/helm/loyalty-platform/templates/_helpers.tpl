{{- /*
loyalty-platform.labels - Standard Helm labels
*/}}
{{- define "loyalty-platform.labels" -}}
helm.sh/chart: {{ include "loyalty-platform.chart" . }}
{{ include "loyalty-platform.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- range $key, $value := .Values.global.labels }}
{{ $key }}: {{ $value }}
{{- end }}
{{- end }}

{{- /*
loyalty-platform.selectorLabels - Selector labels
*/}}
{{- define "loyalty-platform.selectorLabels" -}}
app.kubernetes.io/name: {{ .componentName | default .Release.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- /*
loyalty-platform.chart - Chart name and version
*/}}
{{- define "loyalty-platform.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- /*
loyalty-platform.name - Service name
*/}}
{{- define "loyalty-platform.name" -}}
{{- $name := .componentName | default .Values.global.nameOverride | default .Chart.Name }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- /*
loyalty-platform.serviceAccountName - Service account name
*/}}
{{- define "loyalty-platform.serviceAccountName" -}}
{{- if .serviceAccount.create }}
{{- default (include "loyalty-platform.name" .) .serviceAccount.name }}
{{- else }}
{{- default "default" .serviceAccount.name }}
{{- end }}
{{- end }}

{{- /*
loyalty-platform.imagePullSecrets - Image pull secrets
*/}}
{{- define "loyalty-platform.imagePullSecrets" -}}
{{- if .Values.global.imagePullSecrets }}
imagePullSecrets:
{{- range .Values.global.imagePullSecrets }}
  - name: {{ . }}
{{- end }}
{{- end }}
{{- end }}

{{- /*
loyalty-platform.securityContext - Pod security context
*/}}
{{- define "loyalty-platform.securityContext" -}}
securityContext:
  seccompProfile:
    type: RuntimeDefault
{{- end }}

{{- /*
loyalty-platform.containerSecurityContext - Container security context
*/}}
{{- define "loyalty-platform.containerSecurityContext" -}}
securityContext:
  allowPrivilegeEscalation: false
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
{{- end }}

{{- /*
loyalty-platform.probes - Common probe definitions
Usage: {{ include "loyalty-platform.probes" (dict "context" $ "component" . "port" 3001 "path" "/health") }}
*/}}
{{- define "loyalty-platform.probes" -}}
livenessProbe:
  httpGet:
    path: {{ .path }}
    port: {{ .port }}
  initialDelaySeconds: {{ .component.health.initialDelaySeconds }}
  periodSeconds: {{ .component.health.periodSeconds }}
  timeoutSeconds: {{ .component.health.timeoutSeconds }}
  failureThreshold: {{ .component.health.failureThreshold }}
  successThreshold: 1
readinessProbe:
  httpGet:
    path: {{ .path }}
    port: {{ .port }}
  initialDelaySeconds: 10
  periodSeconds: 10
  timeoutSeconds: 3
  failureThreshold: 2
  successThreshold: 1
startupProbe:
  httpGet:
    path: {{ .path }}
    port: {{ .port }}
  initialDelaySeconds: {{ .component.health.startupDelay }}
  periodSeconds: 5
  failureThreshold: {{ .component.health.startupFailureThreshold }}
{{- end }}

{{- /*
loyalty-platform.envFromConfigMap - Env from configmap
*/}}
{{- define "loyalty-platform.envFromConfigMap" -}}
- configMapRef:
    name: {{ .componentName }}-config
{{- end }}

{{- /*
loyalty-platform.envFromSecrets - Env from secrets
*/}}
{{- define "loyalty-platform.envFromSecrets" -}}
{{- range .component.secrets }}
- name: {{ .name }}
  valueFrom:
    secretKeyRef:
      name: {{ $.Values.global.namespace }}-secrets
      key: {{ .key }}
{{- end }}
{{- end }}
