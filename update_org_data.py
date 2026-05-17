filepath = 'src/components/OrganizationSetup/Structure/OrgChart.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the mockOrgData with Kenyan Micro-lending specific data
import re

new_data = """const mockOrgData: OrgNode = {
  id: '1',
  role: 'Chief Executive Officer',
  department: 'Executive',
  children: [
    {
      id: '2',
      role: 'Chief Operations Officer',
      department: 'Operations',
      children: [
        {
          id: '5',
          role: 'Head of Credit & Risk',
          children: [
            { id: '10', role: 'Credit Analysts' },
            { id: '11', role: 'Debt Recovery Manager' }
          ]
        },
        {
          id: '6',
          role: 'Branch Operations Manager',
          children: [
            { id: '12', role: 'Branch Managers' },
            { id: '13', role: 'Loan Officers' }
          ]
        }
      ]
    },
    {
      id: '3',
      role: 'Chief Financial Officer',
      department: 'Finance',
      children: [
        { id: '7', role: 'Chief Accountant' },
        { id: '8', role: 'Treasury Manager' }
      ]
    },
    {
      id: '4',
      role: 'Head of HR & Admin',
      department: 'Human Resources',
    },
    {
      id: '9',
      role: 'IT & Systems Manager',
      department: 'Technology',
    }
  ]
};"""

content = re.sub(r'const mockOrgData: OrgNode = \{.*?\n\};\n', new_data + '\n', content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

print("OrgChart data updated.")
