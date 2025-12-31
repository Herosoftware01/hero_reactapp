// src/page/AIModel.tsx

// Fetches data from the orders API and responds to simple natural-language prompts.
// Supported intents: count rows, find jobs by company, sort, clear sorting, show only completed, group by column.

export const fetchAI = async (
  prompt: string,
  grid: any,          // Syncfusion Grid instance
  dialog: any,        // Syncfusion Dialog instance
  assistView: any,    // Syncfusion AIAssistView instance
  columns: any[]      // Grid columns data (array of { field })
) => {
  const lower = (prompt || '').toLowerCase();
  console.debug('fetchAI called with prompt:', prompt);
  // Ensure the prompt exists in assistView.prompts and show a 'Thinking...' placeholder
  try {
    const prompts = Array.isArray((assistView as any)?.prompts) ? [...(assistView as any).prompts] : [];
    if (prompts.length === 0 || (prompts[prompts.length - 1].prompt || '') !== prompt) {
      prompts.push({ prompt, response: 'Thinking...' });
    } else {
      prompts[prompts.length - 1].response = 'Thinking...';
    }
    if (assistView) (assistView as any).prompts = prompts;
  } catch (e) {
    console.warn('Could not set prompts array on assistView', e);
  }
  assistView?.scrollToBottom?.();

  try {
    const res = await fetch('http://127.0.0.1:8000/order_panda/');
    const data = await res.json();
    const rows: any[] = Array.isArray(data) ? data : (data.result || []);

    // Helpers
    const findField = (keyword: string) => {
      keyword = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '');
      for (const c of columns || []) {
        if (!c || !c.field) continue;
        if (c.field.toLowerCase().replace(/[^a-z0-9]+/g, '').includes(keyword)) return c.field;
      }
      return null;
    };

    let response = "I couldn't find an answer for that.";

    // Count intent (e.g., "how many job no")
    if (/how many.*job/.test(lower) || /how many.*rows/.test(lower) || /how many.*items/.test(lower)) {
      response = `There are ${rows.length} rows in the table.`;
    }

    // Find jobs for company (e.g., "Find jobs for HERO FASHION")
    else if (/find jobs for/.test(lower) || /find .*jobs/.test(lower)) {
      const m = prompt.match(/find jobs for\s+(.+)/i) || prompt.match(/find\s+(.+)/i);
      const company = m ? m[1].trim() : '';
      if (company) {
        const matches = rows.filter((r: any) => (r.company_name || '').toLowerCase().includes(company.toLowerCase()));
        if (matches.length === 0) response = `No jobs found for "${company}".`;
        else {
          const jobList = matches.slice(0, 10).map((r: any) => r.jobno_oms_id || r.jobno || r.id).filter(Boolean);
          response = `Found ${matches.length} job(s) for "${company}". Job IDs (first ${Math.min(matches.length, 10)}): ${jobList.join(', ')}.`;
        }
      } else {
        response = 'Please specify a company to search for.';
      }
    }

    // Sort commands (e.g., "Sort by Final Delivery Date descending")
    else if (/sort by/.test(lower)) {
      const m = prompt.match(/sort by\s+(.+?)(?:\s+(ascending|descending))?$/i);
      if (m) {
        const fieldPhrase = m[1].trim();
        const dir = (m[2] || 'ascending').toLowerCase().includes('desc') ? 'Descending' : 'Ascending';
        const field = findField(fieldPhrase) || fieldPhrase.replace(/\s+/g, '_');
        if (grid && typeof grid.sortColumn === 'function') {
          grid.sortColumn(field, dir);
          response = `Sorted by ${fieldPhrase} (${dir}).`;
        } else {
          response = `Would sort by ${fieldPhrase} (${dir}) if the grid supported programmatic sorting.`;
        }
      }
    }

    // Clear sorting
    else if (/clear sorting/.test(lower) || /reset sorting/.test(lower)) {
      if (grid && typeof grid.clearSorting === 'function') {
        grid.clearSorting();
        response = 'Sorting cleared.';
      } else {
        response = 'Grid does not support clearing sorting programmatically in this environment.';
      }
    }

    // Show only completed shipments
    else if (/completed shipments|show only completed/.test(lower)) {
      if (grid && typeof grid.filterByColumn === 'function') {
        grid.filterByColumn('shipmentcompleted', 'equal', 'true');
        response = 'Filtered to show only completed shipments.';
      } else {
        // fallback: count completed and return result
        const completed = rows.filter((r: any) => !!r.shipmentcompleted);
        response = `Found ${completed.length} completed shipment(s).`;
      }
    }

    // Group by column
    else if (/group by/.test(lower)) {
      const m = prompt.match(/group by\s+(.+)$/i);
      if (m) {
        const fieldPhrase = m[1].trim();
        const field = findField(fieldPhrase) || fieldPhrase.replace(/\s+/g, '_');
        if (grid && typeof grid.groupColumn === 'function') {
          grid.groupColumn(field);
          response = `Grouped by ${fieldPhrase}.`;
        } else if (grid && grid.setProperties) {
          grid.setProperties({ groupSettings: { columns: [field] } });
          grid.refresh();
          response = `Grouped by ${fieldPhrase}.`;
        } else {
          response = `Would group by ${fieldPhrase} if the grid supported programmatic grouping.`;
        }
      }
    }

    // Fallback: return top-level summary
    else {
      const sample = rows.slice(0, 3).map((r: any) => ({ job: r.jobno_oms_id, company: r.company_name }));
      response = `I couldn't parse a specific command. The table has ${rows.length} rows. Example rows: ${JSON.stringify(sample)}.`;
    }

    // Replace the 'Thinking...' placeholder with the actual response.
    try {
      const prompts = Array.isArray((assistView as any)?.prompts) ? [...(assistView as any).prompts] : [];
      if (prompts.length && (prompts[prompts.length - 1].prompt || '') === prompt) {
        prompts[prompts.length - 1].response = response;
      } else {
        prompts.push({ prompt, response });
      }
      if (assistView) (assistView as any).prompts = prompts;
    } catch (e) {
      console.warn('Could not update prompts array on assistView', e);
      if (assistView && typeof assistView.addPromptResponse === 'function') {
        try { assistView.addPromptResponse(response); } catch (e2) { console.warn('addPromptResponse failed', e2); }
      }
    }
    assistView?.scrollToBottom?.();
    console.debug('fetchAI responded:', response);
  } catch (err) {
    console.error('fetchAI error:', err);
    // If the API is unreachable, try to use the current grid data as a fallback
    let fallbackRows: any[] = [];
    try {
      if (grid && grid.dataSource) {
        fallbackRows = Array.isArray(grid.dataSource) ? grid.dataSource : (grid.dataSource.result || []);
      }
    } catch (_){ /* ignore */ }

    if (fallbackRows.length) {
      // reuse small part of logic to answer simple count/find requests
      if (/how many.*job/.test(lower) || /how many.*rows/.test(lower) || /how many.*items/.test(lower)) {
        assistView?.addPromptResponse?.(prompt, `There are ${fallbackRows.length} rows in the table.`);
      } else if (/find jobs for/.test(lower) || /find .*jobs/.test(lower)) {
        const m = prompt.match(/find jobs for\s+(.+)/i) || prompt.match(/find\s+(.+)/i);
        const company = m ? m[1].trim() : '';
        if (company) {
          const matches = fallbackRows.filter((r: any) => (r.company_name || '').toLowerCase().includes(company.toLowerCase()));
          if (matches.length === 0) assistView?.addPromptResponse?.(prompt, `No jobs found for "${company}".`);
          else {
            const jobList = matches.slice(0, 10).map((r: any) => r.jobno_oms_id || r.jobno || r.id).filter(Boolean);
            assistView?.addPromptResponse?.(prompt, `Found ${matches.length} job(s) for "${company}". Job IDs (first ${Math.min(matches.length, 10)}): ${jobList.join(', ')}.`);
          }
        } else {
          assistView?.addPromptResponse?.(prompt, 'Please specify a company to search for.');
        }
      } else {
        assistView?.addPromptResponse?.(prompt, 'The orders API is unreachable and I could not perform that action locally.');
      }
      assistView?.scrollToBottom?.();
    } else {
      assistView?.addPromptResponse?.(prompt, 'Sorry — I could not reach the orders API.');
      assistView?.scrollToBottom?.();
    }
  }
};