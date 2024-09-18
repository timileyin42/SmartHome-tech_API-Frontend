import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RuleDetail {
  type?: string;
  value?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: RuleDetail;
  condition: RuleDetail;
  action: RuleDetail;
}

const AutomationRules: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: { type: '', value: '' },
    condition: { type: '', value: '' },
    action: { type: '', value: '' },
  });
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ data: AutomationRule[] }>('http://localhost:3000/api/automation-rules', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRules(response.data.data);
      } catch (err: unknown) {
        handleAxiosError(err, 'Failed to fetch automation rules.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
  };

  const createRule = async () => {
    setLoading(true);
    try {
      const response = await axios.post<{ data: AutomationRule }>('http://localhost:3000/api/automation-rules', newRule, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRules([...rules, response.data.data]);
      resetForm(); // Reset form after successful creation
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to create the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async () => {
    if (!selectedRule) return;
    setLoading(true);
    try {
      const response = await axios.put<{ data: AutomationRule }>(
        `http://localhost:3000/api/automation-rules/${selectedRule.id}`,
        selectedRule,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const updatedRules = rules.map((rule) =>
        rule.id === selectedRule.id ? response.data.data : rule
      );
      setRules(updatedRules);
      resetForm(); // Reset form after successful update
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to update the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`https://smart-home-tech-api.vercel.app/api/automation-rules/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRules(rules.filter((rule) => rule.id !== id));
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to delete the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewRule({ name: '', trigger: { type: '', value: '' }, condition: { type: '', value: '' }, action: { type: '', value: '' } });
    setSelectedRule(null);
  };

  return (
    <div>
      <h2>Automation Rules</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectedRule ? updateRule() : createRule();
        }}
      >
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={selectedRule ? selectedRule.name : newRule.name || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, name: e.target.value })
                : setNewRule({ ...newRule, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Trigger Type:</label>
          <input
            type="text"
            value={selectedRule ? selectedRule.trigger?.type : newRule.trigger?.type || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, trigger: { ...selectedRule.trigger, type: e.target.value } })
                : setNewRule({ ...newRule, trigger: { ...newRule.trigger, type: e.target.value } })
            }
            required
          />
          <label>Trigger Value:</label>
          <input
            type="text"
            value={selectedRule ? selectedRule.trigger?.value : newRule.trigger?.value || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, trigger: { ...selectedRule.trigger, value: e.target.value } })
                : setNewRule({ ...newRule, trigger: { ...newRule.trigger, value: e.target.value } })
            }
            required
          />
        </div>
        {/* Repeat similarly for Condition and Action */}
        <button type="submit" disabled={loading}>
          {selectedRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </form>

      <h3>Existing Automation Rules</h3>
      {rules.length > 0 ? (
        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              <span>
                Name: {rule.name}, Trigger: {rule.trigger.type} - {rule.trigger.value}, Condition: {rule.condition.type} - {rule.condition.value}, Action: {rule.action.type} - {rule.action.value}
              </span>
              <button onClick={() => setSelectedRule(rule)}>Edit</button>
              <button onClick={() => deleteRule(rule.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No automation rules found.</p>
      )}
    </div>
  );
};

export default AutomationRules;

