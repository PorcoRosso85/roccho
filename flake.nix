{
  description = "My Neovim flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # Or whatever system you are on
      pkgs = import nixpkgs { inherit system; };

      # database = import ./database.nix { inherit pkgs; };
    in
    {
      packages.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.neovim
          pkgs.zsh
          pkgs.zsh-powerlevel10k
          pkgs.git
          pkgs.gh
          pkgs.curl
          pkgs.wget
          pkgs.eza
          pkgs.fd
          pkgs.bat
          pkgs.lazygit
          pkgs.nil
          pkgs.nixpkgs-fmt

          pkgs.docker
          pkgs.lazydocker
          # pkgs.containerd?
          # pkgs.act

        ];

        shellHook = ''
          echo "Hello, world! \nShell hook ran by nix flakes."

          # Start postgresql
          # 現在のディレクトリ名を取得
          current_dir=$(basename "$PWD")
          # コンテナ名を設定
          container_name="postgres-$current_dir"
          # PostgreSQLのパスワードを設定 
          postgres_password="$current_dir"
          # Dockerコンテナを起動
          docker run --name "$container_name" -e POSTGRES_PASSWORD="$postgres_password" -d -p 5432:5432 postgres
          # 無事起動したかpsqlで確認し、確認ができたらpsqlを終了
          docker exec -it "$container_name" psql -U postgres -c "SELECT version();"
          
          # psqlでの接続用のエイリアスを設定
          alias psql="docker exec -it $container_name psql -U postgres"
        '';

      };
    };
}
