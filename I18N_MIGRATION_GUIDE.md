# 🌍 Complete i18n Migration Guide

This guide provides everything needed to implement i18n across your entire codebase.

---

## 📊 Current Status

✅ **COMPLETED:**
- i18n infrastructure (config.js)
- Comprehensive translation files (en.json, fr.json) with 300+ keys
- Reusable UI components (Button, Input, Modal, LanguageToggle)
- Example refactored component (LoginBox.refactored.js)
- Implementation documentation

❌ **PENDING:**
- Implement i18n in remaining 50+ components
- Replace hardcoded text with t() calls
- Remove `isEnglish` prop patterns
- Remove duplicate EN/FR JSX blocks

---

## 🎯 Quick Start Checklist

### 1. Install Dependencies (if not already done)
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

### 2. Import i18n in `src/index.js`
```javascript
import './i18n/config'; // BEFORE App import
import App from './App';
```

### 3. Add Language Toggle to Header
```javascript
import { LanguageToggle } from './components/ui';

// In your Header component:
<Header>
  {/* ... other header content */}
  <LanguageToggle size="medium" />
</Header>
```

---

## 🔄 Component Migration Process

### Step-by-Step for Each Component:

#### 1. Add useTranslation Hook
```javascript
// Add to imports
import { useTranslation } from 'react-i18next';

// In component
const MyComponent = () => {
  const { t } = useTranslation();

  // ... rest of component
};
```

#### 2. Replace Hardcoded Text
```javascript
// ❌ BEFORE:
<Title>master control</Title>
<Button>apply</Button>
<Input placeholder="select locations" />

// ✅ AFTER:
<Title>{t('masterControl.title')}</Title>
<Button translationKey="common.apply" />
<Input placeholder={t('masterControl.selectLocations')} />
```

#### 3. Remove isEnglish Pattern
```javascript
// ❌ BEFORE:
const [isEnglish, setIsEnglish] = useState(true);
const englishText = [{ title: 'Features' }];
const frenchText = [{ title: 'Caractéristiques' }];
const content = isEnglish ? englishText : frenchText;

return <h1>{content[0].title}</h1>;

// ✅ AFTER:
const { t } = useTranslation();
return <h1>{t('navigation.features')}</h1>;
```

#### 4. Remove Duplicate JSX Blocks
```javascript
// ❌ BEFORE:
{isEnglish ? (
  <Wrapper>
    <Title>login</Title>
    <Button>enter</Button>
  </Wrapper>
) : (
  <Wrapper>
    <Title>connexion</Title>
    <Button>entrer</Button>
  </Wrapper>
)}

// ✅ AFTER:
<Wrapper>
  <Title>{t('auth.login')}</Title>
  <Button translationKey="auth.enter" />
</Wrapper>
```

---

## 📝 Translation Key Reference

### Common Actions
```javascript
t('common.apply')      // "apply" / "appliquer"
t('common.save')       // "save" / "enregistrer"
t('common.cancel')     // "cancel" / "annuler"
t('common.confirm')    // "confirm" / "confirmer"
t('common.ok')         // "ok" / "ok"
t('common.select')     // "select" / "sélectionner"
t('common.search')     // "search" / "rechercher"
```

### Master Control
```javascript
t('masterControl.title')                        // "master control"
t('masterControl.selectLocations')              // "select locations"
t('masterControl.programs.heatingSchedule')     // "heating schedule program"
t('masterControl.programs.fanOnly')             // "fan only program"
t('masterControl.programs.windFactor')          // "wind factor program"
t('masterControl.heatingSchedule.inputTemp')    // "input temp."
t('masterControl.heatingSchedule.wrongTemperature') // "wrong temperature"
```

### Faults
```javascript
t('faults.title')                    // "faults"
t('faults.systems.ess')              // "electric switch systems"
t('faults.attend.title')             // "attend"
t('faults.attend.userName')          // "uos user name :"
t('faults.attend.fault')             // "fault"
t('faults.attend.addComment')        // "add a comment"
```

### Audit Trail
```javascript
t('auditTrail.title')                // "audit trail"
t('auditTrail.selectBy')             // "select by"
t('auditTrail.selectStartDate')      // "select start date"
t('auditTrail.selectEndDate')        // "select end date"
t('auditTrail.options.userName')     // "user name"
t('auditTrail.options.location')     // "location"
```

**See `src/i18n/locales/en.json` for complete key reference!**

---

## 🎨 Using Reusable Components

### Button Component
```javascript
import { Button } from '../components/ui';

// With translation key
<Button variant="save" translationKey="common.save" onClick={handleSave} />

// With custom text
<Button variant="primary" onClick={handleClick}>
  {t('custom.key')}
</Button>

// All variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="confirm">Confirm</Button>
<Button variant="save">Save</Button>
<Button variant="cancel">Cancel</Button>
<Button variant="apply">Apply</Button>
```

### Input Component
```javascript
import { Input } from '../components/ui';

<Input
  type="text"
  label="masterControl.selectLocations"
  placeholder="masterControl.selectLocations"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
/>
```

### Modal Component
```javascript
import { Modal } from '../components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title={t('common.confirm')}
>
  <p>{t('messages.confirmDelete')}</p>
  <Button variant="confirm" onClick={handleConfirm}>
    {t('common.confirm')}
  </Button>
</Modal>
```

---

## 🔨 Automated Find & Replace Patterns

Use these regex patterns in your IDE to speed up migration:

### Pattern 1: Simple Button Text
**Find:** `<([A-Z][a-zA-Z]+)>apply</\1>`
**Replace:** `<$1>{t('common.apply')}</$1>`

### Pattern 2: Placeholder Attributes
**Find:** `placeholder="select locations"`
**Replace:** `placeholder={t('masterControl.selectLocations')}`

### Pattern 3: Title/Heading Text
**Find:** `<Title>master control</Title>`
**Replace:** `<Title>{t('masterControl.title')}</Title>`

---

## 📂 Component Migration Priority

### 🔴 HIGH PRIORITY (Most Used Components)

1. **Master Control Components:**
   - `/src/components/masterControl/MasterControlMain.js`
     - Replace: "master control" → `t('masterControl.title')`
     - Replace: "please select \"create new command\"" → `t('masterControl.commands.selectCreateNew')`

   - `/src/components/masterControlSwitches/HeatingSchedule.js`
     - Replace: "heating schedule program" → `t('masterControl.programs.heatingSchedule')`
     - Replace: "input temp." → `t('masterControl.heatingSchedule.inputTemp')`
     - Replace: "apply" → `t('common.apply')`

   - `/src/components/masterControlSwitches/FanOnly.js`
     - Replace: "fan only program" → `t('masterControl.programs.fanOnly')`

   - `/src/components/masterControlSwitches/WindFactor.js`
     - Replace: "wind factor program" → `t('masterControl.programs.windFactor')`

   - `/src/components/masterControlSwitches/Ats.js`
     - Replace: "select ats" → `t('masterControl.ats.title')`
     - Replace: "apply" → `t('common.apply')`

   - `/src/components/masterControlSwitches/OptionalConstant.js`
     - Replace: "opt. const. temp. program" → `t('masterControl.programs.optionalConstant')`

2. **Faults Components:**
   - `/src/components/faults/FaultsMain.js`
     - Replace: "faults" → `t('faults.title')`
     - Replace: "electric switch systems" → `t('faults.systems.ess')`

   - `/src/components/faults/FaultAddAction.js`
     - Replace: "attend" → `t('faults.attend.title')`
     - Replace: "confirm" → `t('common.confirm')`

3. **Audit Trail Components:**
   - `/src/components/auditTrail/ATMainSelect.js`
     - Replace: "audit trail" → `t('auditTrail.title')`
     - Replace: "select by" → `t('auditTrail.selectBy')`
     - Replace: "search" → `t('common.search')`

4. **Telemetry Components:**
   - `/src/components/telemetry/TelemetryMain.js`
     - Replace: "global system telemetry overview" → `t('telemetry.title')`

5. **Global Overview:**
   - `/src/components/globalOverview/GlobalOverViewMain.js`
     - Replace: "global system overview" → `t('globalOverview.title')`
     - Replace: "integrated systems" → `t('globalOverview.integratedSystems')`

6. **Report Status:**
   - `/src/components/reportStatus/ReportStatusMain.js`
     - Replace: "report status" → `t('reportStatus.title')`

### 🟡 MEDIUM PRIORITY

7. **Sidebar Component:**
   - `/src/components/sidebar/Sidebar.js`
     - Add language toggle
     - Replace navigation text with translation keys

8. **Settings Components:**
   - All files in `/src/components/settings/`
   - Use `settings.*` translation keys

9. **Landing Page Components:**
   - Already have refactored example (LoginBox.refactored.js)
   - Apply same pattern to other landing page components

### 🟢 LOW PRIORITY

10. **Remaining Components:**
    - Message boxes
    - Common components
    - Utility components

---

## 🤖 Automated Migration Script

Create a file `migrate-i18n.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Translation mappings
const translations = {
  // Master Control
  'master control': 'masterControl.title',
  'apply': 'common.apply',
  'select locations': 'masterControl.selectLocations',
  'heating schedule program': 'masterControl.programs.heatingSchedule',
  'fan only program': 'masterControl.programs.fanOnly',

  // Faults
  'faults': 'faults.title',
  'attend': 'faults.attend.title',
  'confirm': 'common.confirm',

  // Common
  'save': 'common.save',
  'cancel': 'common.cancel',
  'ok': 'common.ok',
  'search': 'common.search',
  'select': 'common.select',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add useTranslation import if not present
  if (!content.includes('useTranslation')) {
    const importLine = "import { useTranslation } from 'react-i18next';\n";
    content = content.replace(
      /(import.*from\s+['"]react['"];)/,
      `$1\n${importLine}`
    );
  }

  // Add const { t } = useTranslation(); if not present
  if (!content.includes('const { t } = useTranslation()')) {
    content = content.replace(
      /(const\s+\w+\s+=\s+\([^)]*\)\s+=>\s+{)/,
      `$1\n  const { t } = useTranslation();`
    );
  }

  // Replace hardcoded text with t() calls
  Object.entries(translations).forEach(([text, key]) => {
    // Replace in JSX text
    const regex1 = new RegExp(`>\\s*${text}\\s*<`, 'gi');
    content = content.replace(regex1, `>{t('${key}')}<`);

    // Replace in placeholders
    const regex2 = new RegExp(`placeholder=["']${text}["']`, 'gi');
    content = content.replace(regex2, `placeholder={t('${key}')}`);

    // Replace in title attributes
    const regex3 = new RegExp(`title=["']${text}["']`, 'gi');
    content = content.replace(regex3, `title={t('${key}')}`);
  });

  fs.writeFileSync(filePath, content);
  console.log(`✅ Migrated: ${filePath}`);
}

// Run on target directory
const targetDir = process.argv[2] || './src/components/masterControl';
const files = fs.readdirSync(targetDir)
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(targetDir, f));

files.forEach(migrateFile);
console.log(`\n🎉 Migration complete! ${files.length} files processed.`);
```

**Usage:**
```bash
node migrate-i18n.js ./src/components/masterControl
node migrate-i18n.js ./src/components/faults
node migrate-i18n.js ./src/components/auditTrail
```

---

## ✅ Testing Checklist

After migrating each component:

- [ ] Component renders without errors
- [ ] All text displays correctly in English
- [ ] Switch to French using LanguageToggle
- [ ] All text displays correctly in French
- [ ] No hardcoded text remains
- [ ] No `isEnglish` prop or logic remains
- [ ] No console errors or warnings

---

## 📊 Progress Tracking

Create a checklist as you migrate:

```markdown
## Master Control Components
- [ ] MasterControlMain.js
- [ ] HeatingSchedule.js
- [ ] FanOnly.js
- [ ] WindFactor.js
- [ ] Ats.js
- [ ] OptionalConstant.js
- [ ] SelectMachines.js
- [ ] SelectLocations.js

## Faults Components
- [ ] FaultsMain.js
- [ ] FaultAddAction.js

## Audit Trail Components
- [ ] ATMainSelect.js
- [ ] SelectedByLocation.js
- [ ] DisplaySpecificLocation.js

## Telemetry Components
- [ ] TelemetryMain.js
- [ ] MainSelections.js
- [ ] SelectSwitchMachineOptions.js

## Global Overview
- [ ] GlobalOverViewMain.js
- [ ] IntegratedSystem.js
- [ ] IndividualMachine.js

## Report Status
- [ ] ReportStatusMain.js

## Settings Components
- [ ] SettingsMain.js
- [ ] (All settings sub-components)

## Sidebar
- [ ] Sidebar.js

## Landing Page
- [ ] LandingPage.js (use LoginBox.refactored.js as reference)
- [ ] NavBar.js
- [ ] Features.js
- [ ] About.js
- [ ] ContactForm.js
```

---

## 🐛 Common Issues & Solutions

### Issue: Translation key not found
**Error:** "Missing translation key: 'some.key'"
**Solution:** Add the key to both `en.json` and `fr.json`

### Issue: Text not updating on language change
**Solution:** Make sure you're using `const { t } = useTranslation()` inside the component, not outside

### Issue: Placeholder not translating
**Wrong:** `placeholder="text"`
**Correct:** `placeholder={t('key')}`

### Issue: Old English text still showing
**Solution:** Check for:
- Hardcoded strings in styled-components
- Text in conditional rendering
- Text in array/object definitions

---

## 📈 Expected Results

After full migration:

- ✅ **Zero hardcoded text** in components
- ✅ **Instant language switching** via LanguageToggle
- ✅ **Consistent terminology** across app
- ✅ **50% less code** (no duplicate JSX blocks)
- ✅ **Easy to add new languages** (just add JSON file)
- ✅ **Centralized text management**
- ✅ **Better maintainability**

---

## 🚀 Next Steps After Migration

1. **Add More Languages:**
   ```javascript
   // src/i18n/locales/es.json (Spanish)
   // src/i18n/locales/de.json (German)
   // src/i18n/config.js - add to resources
   ```

2. **Add Language Selector:**
   ```javascript
   // LanguageToggle component supports multiple languages
   // Just update to show all available options
   ```

3. **Professional Translation:**
   - Send `en.json` to professional translators
   - They return translated JSON
   - Drop in as new locale file

4. **Dynamic Content:**
   ```javascript
   t('welcome', { name: userName })
   // en.json: "welcome": "Welcome, {{name}}!"
   ```

---

## 💡 Pro Tips

1. **Use translation keys consistently:**
   - `common.*` for buttons/actions used everywhere
   - `component.title` for component titles
   - `component.messages.*` for user messages

2. **Keep keys organized:**
   - Group by feature, not by page
   - Use hierarchical structure
   - Follow naming conventions

3. **Test as you go:**
   - Migrate one component
   - Test EN/FR switching
   - Fix issues
   - Move to next component

4. **Commit frequently:**
   ```bash
   git add .
   git commit -m "i18n: Migrate Master Control components"
   ```

---

## 📞 Need Help?

Refer to these files for examples:
- `src/components/newLandingPage/LoginBox.refactored.js` - Complete refactored component
- `src/components/ui/Button.js` - Reusable button with i18n
- `src/i18n/config.js` - i18n configuration
- `IMPLEMENTATION_GUIDE.md` - General implementation guide

---

**Good luck with your migration! 🌍**

Remember: Migrate systematically, test frequently, and commit often!
