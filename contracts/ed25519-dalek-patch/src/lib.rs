pub use real_dalek::{Signature, SignatureError, VerifyingKey};
pub use rand_core::{CryptoRng, RngCore};
pub use signature::Signer;

pub const SIGNATURE_LENGTH: usize = 64;
pub const KEYPAIR_LENGTH: usize = 64;
pub const PUBLIC_KEY_LENGTH: usize = 32;
pub const SECRET_KEY_LENGTH: usize = 32;

pub struct SigningKey(real_dalek::SigningKey);

impl SigningKey {
    pub fn generate<R: CryptoRng + RngCore>(csprng: &mut R) -> Self {
        SigningKey(real_dalek::SigningKey::generate(csprng))
    }

    pub fn verifying_key(&self) -> VerifyingKey {
        self.0.verifying_key()
    }

    pub fn to_bytes(&self) -> [u8; 32] {
        self.0.to_bytes()
    }

    pub fn from_bytes(bytes: &[u8; 32]) -> Self {
        SigningKey(real_dalek::SigningKey::from_bytes(bytes))
    }

    pub fn to_keypair_bytes(&self) -> [u8; 64] {
        self.0.to_keypair_bytes()
    }

    pub fn from_keypair_bytes(bytes: &[u8; 64]) -> Result<Self, SignatureError> {
        real_dalek::SigningKey::from_keypair_bytes(bytes).map(SigningKey)
    }
}

impl signature::Signer<Signature> for SigningKey {
    fn try_sign(&self, msg: &[u8]) -> Result<Signature, SignatureError> {
        self.0.try_sign(msg)
    }
}
