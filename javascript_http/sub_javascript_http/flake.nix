{
  description = "A simple flake that says hello";

  outputs = { self, nixpkgs }: {
    defaultPackage.x86_64-linux = with nixpkgs; stdenv.mkDerivation {
      name = "hello-flake";
      buildCommand = ''
        echo "hello" > $out
      '';
    };
  };
}
