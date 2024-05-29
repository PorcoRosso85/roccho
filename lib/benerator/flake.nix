{
  description = "A simple derivation for the myapp package";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      myBinary = pkgs.fetchurl {
        url = "https://github.com/rapiddweller/rapiddweller-benerator-ce/releases/download/3.2.1/rapiddweller-benerator-ce-3.2.1-jdk-11-dist.tar.gz";
        sha256 = "XRs94jRPDCoXGe7Vq4FUp1WXpddpPDc3NOBgOkXl+W0=";
      };
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        name = "myapp";
        src = myBinary;
        nativeBuildInputs = [ pkgs.gnutar pkgs.gzip ];
        buildPhase = ''
          tar -xzf $src
        '';
        installPhase = ''
          cp -r bin $out
          # TODO move the binary to the bin directory, from ./result/bin to 
        '';

      };
    };
}
