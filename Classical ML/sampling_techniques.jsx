import { useState } from "react";

const techniques = {
  oversampling: [
    {
      name: "Random Oversampling",
      tag: "Baseline",
      desc: "Duplicates random minority class samples to balance the dataset. Simple but can cause overfitting since it creates exact copies.",
      pros: ["Dead simple", "No synthetic data", "Works with any model"],
      cons: ["Overfitting risk", "No new information added"],
      code: `from imblearn.over_sampling import RandomOverSampler

ros = RandomOverSampler(random_state=42)
X_res, y_res = ros.fit_resample(X, y)`,
    },
    {
      name: "SMOTE",
      tag: "Most Popular",
      desc: "Synthetic Minority Oversampling TEchnique. Creates synthetic samples by interpolating between a minority sample and its k-nearest neighbors in feature space.",
      pros: ["Reduces overfitting vs random", "Creates diverse samples", "Well-studied"],
      cons: ["Can create noisy samples", "Ignores majority class"],
      code: `from imblearn.over_sampling import SMOTE

smote = SMOTE(k_neighbors=5, random_state=42)
X_res, y_res = smote.fit_resample(X, y)`,
    },
    {
      name: "SMOTE-NC",
      tag: "Mixed Data",
      desc: "SMOTE for Nominal and Continuous features. Handles datasets with both categorical and numerical columns using modified distance metrics.",
      pros: ["Handles mixed feature types", "Based on proven SMOTE"],
      cons: ["Slower than SMOTE", "Needs categorical feature indices"],
      code: `from imblearn.over_sampling import SMOTENC

# categorical_features = indices of cat cols
smotenc = SMOTENC(
    categorical_features=[0, 3],
    random_state=42
)
X_res, y_res = smotenc.fit_resample(X, y)`,
    },
    {
      name: "SMOTE-N",
      tag: "Categorical Only",
      desc: "SMOTE for purely Nominal (categorical) features. Uses Value Difference Metric (VDM) instead of Euclidean distance to handle categorical-only datasets.",
      pros: ["Pure categorical support", "VDM-based distance"],
      cons: ["Only for categorical data", "Limited use cases"],
      code: `from imblearn.over_sampling import SMOTEN

smoten = SMOTEN(random_state=42)
X_res, y_res = smoten.fit_resample(X, y)`,
    },
    {
      name: "Borderline-SMOTE",
      tag: "Boundary Focus",
      desc: "Only generates synthetic samples for minority instances near the decision boundary (borderline samples). Focuses on the most informative regions.",
      pros: ["Targets decision boundary", "Better classification margins"],
      cons: ["Ignores safe minority samples", "Sensitive to noise"],
      code: `from imblearn.over_sampling import BorderlineSMOTE

bsmote = BorderlineSMOTE(
    kind='borderline-1',  # or 'borderline-2'
    random_state=42
)
X_res, y_res = bsmote.fit_resample(X, y)`,
    },
    {
      name: "SVM-SMOTE",
      tag: "SVM-Guided",
      desc: "Uses an SVM classifier to identify support vectors from the minority class, then applies SMOTE-like interpolation near those support vectors.",
      pros: ["Focuses on SVM boundary", "Better for SVM models"],
      cons: ["Computationally expensive", "SVM-specific bias"],
      code: `from imblearn.over_sampling import SVMSMOTE

svm_smote = SVMSMOTE(random_state=42)
X_res, y_res = svm_smote.fit_resample(X, y)`,
    },
    {
      name: "KMeans-SMOTE",
      tag: "Cluster-Aware",
      desc: "Clusters data using KMeans first, then oversamples within clusters that have high minority ratios. Avoids generating noise between clusters.",
      pros: ["Cluster-aware generation", "Avoids between-class noise"],
      cons: ["Sensitive to K choice", "Extra clustering step"],
      code: `from imblearn.over_sampling import KMeansSMOTE

km_smote = KMeansSMOTE(
    kmeans_estimator=10,
    random_state=42
)
X_res, y_res = km_smote.fit_resample(X, y)`,
    },
    {
      name: "ADASYN",
      tag: "Adaptive",
      desc: "Adaptive Synthetic Sampling. Generates more synthetic samples for minority instances that are harder to learn (surrounded by majority samples).",
      pros: ["Adaptive density", "Focuses on hard examples"],
      cons: ["Can amplify noise", "May create outliers"],
      code: `from imblearn.over_sampling import ADASYN

adasyn = ADASYN(n_neighbors=5, random_state=42)
X_res, y_res = adasyn.fit_resample(X, y)`,
    },
    {
      name: "ROSE",
      tag: "Smoothed",
      desc: "Random OverSampling Examples. Generates synthetic data using kernel density estimation (KDE), producing smoother, more realistic samples than SMOTE.",
      pros: ["Smoother distributions", "KDE-based generation"],
      cons: ["Not in imbalanced-learn", "R-native method"],
      code: `# Python equivalent using KDE
from sklearn.neighbors import KernelDensity
import numpy as np

kde = KernelDensity(bandwidth=0.5)
kde.fit(X_minority)
X_syn = kde.sample(n_samples=200)`,
    },
    {
      name: "GANs / CTGAN",
      tag: "Deep Learning",
      desc: "Uses Generative Adversarial Networks to learn the minority class distribution and generate highly realistic synthetic samples. Best for complex tabular data.",
      pros: ["Most realistic samples", "Captures complex patterns"],
      cons: ["Training instability", "Requires tuning & GPU"],
      code: `from sdv.single_table import CTGANSynthesizer
from sdv.metadata import Metadata

metadata = Metadata.detect_from_dataframe(df)
synth = CTGANSynthesizer(metadata, epochs=300)
synth.fit(df_minority)
synthetic = synth.sample(num_rows=500)`,
    },
    {
      name: "VAE Oversampling",
      tag: "Generative",
      desc: "Variational Autoencoders learn a latent representation of minority samples and generate new ones by sampling from the learned latent space.",
      pros: ["Smooth latent space", "More stable than GANs"],
      cons: ["Can produce blurry samples", "Architecture design needed"],
      code: `# Conceptual — using PyTorch
from torch import nn

class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super().__init__()
        self.encoder = nn.Linear(input_dim, latent_dim*2)
        self.decoder = nn.Linear(latent_dim, input_dim)
    # ... train on minority, sample from latent`,
    },
  ],
  undersampling: [
    {
      name: "Random Undersampling",
      tag: "Baseline",
      desc: "Randomly removes majority class samples until balanced. Fast but discards potentially useful information.",
      pros: ["Fastest method", "Reduces training time"],
      cons: ["Loses information", "Unstable results"],
      code: `from imblearn.under_sampling import RandomUnderSampler

rus = RandomUnderSampler(random_state=42)
X_res, y_res = rus.fit_resample(X, y)`,
    },
    {
      name: "NearMiss-1",
      tag: "Distance-Based",
      desc: "Selects majority samples whose average distance to the k closest minority samples is smallest. Keeps majority points nearest to minority class.",
      pros: ["Informed selection", "Keeps boundary samples"],
      cons: ["Computationally expensive", "Sensitive to k"],
      code: `from imblearn.under_sampling import NearMiss

nm1 = NearMiss(version=1, n_neighbors=3)
X_res, y_res = nm1.fit_resample(X, y)`,
    },
    {
      name: "NearMiss-2",
      tag: "Distance-Based",
      desc: "Selects majority samples whose average distance to the k farthest minority samples is smallest. More robust than NearMiss-1.",
      pros: ["More robust", "Better boundary capture"],
      cons: ["Slower than NearMiss-1", "Can miss local patterns"],
      code: `from imblearn.under_sampling import NearMiss

nm2 = NearMiss(version=2, n_neighbors=3)
X_res, y_res = nm2.fit_resample(X, y)`,
    },
    {
      name: "NearMiss-3",
      tag: "Two-Step",
      desc: "For each minority sample, keeps M nearest majority neighbors. A two-step approach that first finds nearest neighbors, then selects based on average distance.",
      pros: ["Two-step filtering", "Preserves local structure"],
      cons: ["Most complex NearMiss", "Parameter sensitive"],
      code: `from imblearn.under_sampling import NearMiss

nm3 = NearMiss(version=3, n_neighbors=3)
X_res, y_res = nm3.fit_resample(X, y)`,
    },
    {
      name: "Tomek Links",
      tag: "Cleaning",
      desc: "Removes majority samples that form Tomek links (nearest-neighbor pairs from different classes). Cleans the decision boundary without aggressive reduction.",
      pros: ["Cleans boundary", "Minimal data loss", "Often combined with SMOTE"],
      cons: ["Mild undersampling", "May not balance dataset"],
      code: `from imblearn.under_sampling import TomekLinks

tl = TomekLinks()
X_res, y_res = tl.fit_resample(X, y)`,
    },
    {
      name: "Edited Nearest Neighbours (ENN)",
      tag: "Cleaning",
      desc: "Removes majority samples misclassified by their k-nearest neighbors. Cleans noisy majority samples near the boundary.",
      pros: ["Noise removal", "Improves boundary clarity"],
      cons: ["Mild reduction", "Depends on k choice"],
      code: `from imblearn.under_sampling import EditedNearestNeighbours

enn = EditedNearestNeighbours(n_neighbors=3)
X_res, y_res = enn.fit_resample(X, y)`,
    },
    {
      name: "Repeated ENN (RENN)",
      tag: "Iterative Cleaning",
      desc: "Applies ENN repeatedly until no more samples are removed. More aggressive cleaning than a single pass of ENN.",
      pros: ["Thorough cleaning", "Converges automatically"],
      cons: ["Can remove too much", "Slower than ENN"],
      code: `from imblearn.under_sampling import RepeatedEditedNearestNeighbours

renn = RepeatedEditedNearestNeighbours(
    n_neighbors=3, max_iter=100
)
X_res, y_res = renn.fit_resample(X, y)`,
    },
    {
      name: "All-KNN",
      tag: "Multi-K Cleaning",
      desc: "Applies ENN with increasing values of k (1 to n_neighbors). Removes a sample if misclassified at any k value. Stricter than ENN.",
      pros: ["Multi-scale cleaning", "More thorough than ENN"],
      cons: ["Aggressive removal", "Computationally heavier"],
      code: `from imblearn.under_sampling import AllKNN

allknn = AllKNN(n_neighbors=5)
X_res, y_res = allknn.fit_resample(X, y)`,
    },
    {
      name: "Condensed Nearest Neighbours (CNN)",
      tag: "Prototype Selection",
      desc: "Keeps only majority samples needed for correct 1-NN classification. Builds a minimal consistent subset of the majority class.",
      pros: ["Minimal subset", "Preserves decision boundary"],
      cons: ["Sensitive to noise", "Order-dependent"],
      code: `from imblearn.under_sampling import CondensedNearestNeighbour

cnn = CondensedNearestNeighbour(random_state=42)
X_res, y_res = cnn.fit_resample(X, y)`,
    },
    {
      name: "One-Sided Selection (OSS)",
      tag: "Hybrid Cleaning",
      desc: "Combines Tomek Links + CNN. First removes Tomek links (noise), then applies CNN (redundancy). Gets a clean, compact majority set.",
      pros: ["Noise + redundancy removal", "Better than either alone"],
      cons: ["Two-step overhead", "Can be aggressive"],
      code: `from imblearn.under_sampling import OneSidedSelection

oss = OneSidedSelection(random_state=42)
X_res, y_res = oss.fit_resample(X, y)`,
    },
    {
      name: "Neighbourhood Cleaning Rule (NCR)",
      tag: "Cleaning",
      desc: "Uses ENN to clean majority class, but also removes majority samples whose class disagrees with 3-NN prediction. Focuses on cleaning, not balancing.",
      pros: ["Strong cleaning rule", "Preserves minority"],
      cons: ["Doesn't guarantee balance", "Complex logic"],
      code: `from imblearn.under_sampling import NeighbourhoodCleaningRule

ncr = NeighbourhoodCleaningRule(n_neighbors=3)
X_res, y_res = ncr.fit_resample(X, y)`,
    },
    {
      name: "Instance Hardness Threshold",
      tag: "Model-Based",
      desc: "Trains a classifier and removes majority samples with low prediction probability (hard instances). Keeps the most learnable majority samples.",
      pros: ["Model-driven selection", "Removes ambiguous samples"],
      cons: ["Depends on classifier choice", "Extra training cost"],
      code: `from imblearn.under_sampling import InstanceHardnessThreshold
from sklearn.linear_model import LogisticRegression

iht = InstanceHardnessThreshold(
    estimator=LogisticRegression(),
    random_state=42
)
X_res, y_res = iht.fit_resample(X, y)`,
    },
    {
      name: "Cluster Centroids",
      tag: "Centroid-Based",
      desc: "Replaces majority class with cluster centroids from KMeans. Reduces majority class to K representative points.",
      pros: ["Representative samples", "Controlled reduction"],
      cons: ["Creates artificial points", "Loses real samples"],
      code: `from imblearn.under_sampling import ClusterCentroids

cc = ClusterCentroids(random_state=42)
X_res, y_res = cc.fit_resample(X, y)`,
    },
  ],
  hybrid: [
    {
      name: "SMOTE + Tomek Links",
      tag: "Most Common Hybrid",
      desc: "First applies SMOTE to oversample minority, then uses Tomek Links to clean noisy samples from both classes. Best of both worlds.",
      pros: ["Clean decision boundary", "Balanced + denoised"],
      cons: ["Two-step computation", "SMOTE limitations remain"],
      code: `from imblearn.combine import SMOTETomek

smt = SMOTETomek(random_state=42)
X_res, y_res = smt.fit_resample(X, y)`,
    },
    {
      name: "SMOTE + ENN",
      tag: "Aggressive Hybrid",
      desc: "SMOTE oversampling followed by ENN cleaning. More aggressive cleaning than Tomek, removes more noisy synthetic and majority samples.",
      pros: ["Strong cleaning", "Cleaner than SMOTE+Tomek"],
      cons: ["May remove too many samples", "Parameter sensitivity"],
      code: `from imblearn.combine import SMOTEENN

smenn = SMOTEENN(random_state=42)
X_res, y_res = smenn.fit_resample(X, y)`,
    },
  ],
};

const categoryMeta = {
  oversampling: {
    icon: "▲",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #065f46, #10b981)",
    label: "Oversampling",
    subtitle: "Increase minority class samples",
  },
  undersampling: {
    icon: "▼",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #92400e, #f59e0b)",
    label: "Undersampling",
    subtitle: "Reduce majority class samples",
  },
  hybrid: {
    icon: "◆",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
    label: "Hybrid Methods",
    subtitle: "Combine both approaches",
  },
};

function TechniqueCard({ t, catColor, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 12,
        border: `1px solid ${isOpen ? catColor + "66" : "var(--border)"}`,
        overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: isOpen ? `0 4px 24px ${catColor}18` : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
          color: "var(--text)",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            background: catColor + "1a",
            color: catColor,
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {t.tag}
        </span>
        <span style={{ fontWeight: 600, fontSize: 15, flex: 1 }}>{t.name}</span>
        <span
          style={{
            fontSize: 18,
            color: "var(--text-dim)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 20px 20px" }}>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              margin: "0 0 14px",
            }}
          >
            {t.desc}
          </p>
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#10b981",
                  marginBottom: 6,
                }}
              >
                ✓ Pros
              </div>
              {t.pros.map((p, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    padding: "2px 0",
                  }}
                >
                  · {p}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#ef4444",
                  marginBottom: 6,
                }}
              >
                ✗ Cons
              </div>
              {t.cons.map((c, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    padding: "2px 0",
                  }}
                >
                  · {c}
                </div>
              ))}
            </div>
          </div>
          <pre
            style={{
              background: "var(--code-bg)",
              borderRadius: 8,
              padding: 16,
              overflowX: "auto",
              fontSize: 12.5,
              lineHeight: 1.6,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: "var(--code-text)",
              margin: 0,
              border: "1px solid var(--border)",
            }}
          >
            <code>{t.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function SamplingGuide() {
  const [activeCategory, setActiveCategory] = useState("oversampling");
  const [openCards, setOpenCards] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCard = (key) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    const allKeys = techniques[activeCategory]
      .filter(
        (t) =>
          !searchTerm ||
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((t) => `${activeCategory}-${t.name}`);
    setOpenCards(new Set(allKeys));
  };

  const collapseAll = () => setOpenCards(new Set());

  const filteredTechniques = techniques[activeCategory].filter(
    (t) =>
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCount = Object.values(techniques).reduce((s, a) => s + a.length, 0);

  return (
    <div
      style={{
        "--bg": "#0f1117",
        "--card-bg": "#161822",
        "--border": "#232636",
        "--text": "#e8eaf0",
        "--text-secondary": "#9ca3b4",
        "--text-dim": "#5a6078",
        "--code-bg": "#0d0e14",
        "--code-text": "#c4cad8",
        "--input-bg": "#1a1c2a",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily:
          "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "32px 20px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: 10,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Data Science Reference
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: -0.5,
              lineHeight: 1.2,
            }}
          >
            Sampling Techniques
            <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>
              {" "}
              — {totalCount} methods
            </span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Complete guide to handling imbalanced datasets with practical code
            snippets
          </p>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key);
                setOpenCards(new Set());
              }}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border:
                  activeCategory === key
                    ? `1.5px solid ${meta.color}`
                    : "1.5px solid var(--border)",
                background:
                  activeCategory === key ? meta.color + "14" : "transparent",
                color: activeCategory === key ? meta.color : "var(--text-dim)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>{meta.icon}</span>
              {meta.label}
              <span
                style={{
                  fontSize: 11,
                  background:
                    activeCategory === key
                      ? meta.color + "22"
                      : "var(--input-bg)",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {techniques[key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Controls */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--input-bg)",
              color: "var(--text)",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            onClick={expandAll}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--input-bg)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--input-bg)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            Collapse
          </button>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 12,
            color: categoryMeta[activeCategory].color,
            fontWeight: 600,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{categoryMeta[activeCategory].icon}</span>
          {categoryMeta[activeCategory].subtitle}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredTechniques.map((t) => {
            const key = `${activeCategory}-${t.name}`;
            return (
              <TechniqueCard
                key={key}
                t={t}
                catColor={categoryMeta[activeCategory].color}
                isOpen={openCards.has(key)}
                onToggle={() => toggleCard(key)}
              />
            );
          })}
          {filteredTechniques.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "var(--text-dim)",
                fontSize: 14,
              }}
            >
              No techniques match "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            padding: "16px 20px",
            borderRadius: 10,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            fontSize: 12.5,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--text)" }}>Quick Install: </strong>
          <code
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: "var(--code-bg)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            pip install imbalanced-learn sdv
          </code>
          <span style={{ margin: "0 8px", color: "var(--text-dim)" }}>·</span>
          All code uses{" "}
          <code
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: "var(--code-bg)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            fit_resample(X, y)
          </code>{" "}
          API from imbalanced-learn unless noted.
        </div>
      </div>
    </div>
  );
}
