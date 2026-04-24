export interface FailurePanelOptions {
  onRetry: () => void;
  onReport: () => void;
}

export function renderSafeFailurePanel(container: HTMLElement, options: FailurePanelOptions): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'rentalos-safe-failure';

  const title = document.createElement('h3');
  title.textContent = "Couldn’t parse this page yet";
  wrapper.appendChild(title);

  const body = document.createElement('p');
  body.textContent = 'This page layout appears to be new. You can retry extraction or report this page to improve parser coverage.';
  wrapper.appendChild(body);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'rentalos-safe-failure__actions';

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.textContent = 'Retry';
  retryButton.addEventListener('click', options.onRetry);

  const reportButton = document.createElement('button');
  reportButton.type = 'button';
  reportButton.textContent = 'Report page';
  reportButton.addEventListener('click', options.onReport);

  buttonRow.append(retryButton, reportButton);
  wrapper.appendChild(buttonRow);

  container.appendChild(wrapper);
}

export function shouldShowSafeFailure(confidences: number[]): boolean {
  if (confidences.length === 0) {
    return true;
  }

  const avgConfidence = confidences.reduce((sum, value) => sum + value, 0) / confidences.length;
  return avgConfidence < 0.45;
}
